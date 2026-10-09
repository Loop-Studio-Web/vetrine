/* Shader della tavola: render e acquerello dalla stessa immagine.
   L'acquerello non è un'illustrazione a parte: è il render passato in un filtro
   (Kuwahara leggero, assorbimento del pigmento, bordi che si caricano, granulazione
   della carta) che si asciuga a chiazze lasciando la riga di marea del colore. */

export const vert = /* glsl */ `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

export const frag = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uAsp;          // larghezza / altezza delle immagini (0.8)
uniform sampler2D uA, uB;
uniform vec2 uTA, uTB;       // dimensioni delle texture
uniform vec3 uVA, uVB;       // vista: cx, cy, z
uniform float uTaglio, uAsciutto, uTempo;
uniform vec3 uCarta;         // colore della carta
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float s = 0.0, a = 0.5;
	for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
	return s;
}

vec2 aUV(vec3 v) {
	vec2 q = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
	q.y = -q.y;
	return vec2(v.x + q.x / uAsp / v.z, v.y + q.y / v.z);
}

float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Kuwahara a quattro quadranti, 25 campioni: stese piatte con i bordi netti.
vec3 kuwahara(sampler2D t, vec2 uv, vec2 passo, float lod, float ang) {
	mat2 r = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
	vec3 m0 = vec3(0), m1 = vec3(0), m2 = vec3(0), m3 = vec3(0);
	vec3 s0 = vec3(0), s1 = vec3(0), s2 = vec3(0), s3 = vec3(0);
	for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
		vec3 c = textureLod(t, uv + (r * vec2(i, j)) * passo, lod).rgb;
		vec3 c2 = c * c;
		if (i <= 0 && j <= 0) { m0 += c; s0 += c2; }
		if (i >= 0 && j <= 0) { m1 += c; s1 += c2; }
		if (i <= 0 && j >= 0) { m2 += c; s2 += c2; }
		if (i >= 0 && j >= 0) { m3 += c; s3 += c2; }
	}
	m0 /= 9.0; m1 /= 9.0; m2 /= 9.0; m3 /= 9.0;
	float v0 = dot(s0 / 9.0 - m0 * m0, vec3(1)), v1 = dot(s1 / 9.0 - m1 * m1, vec3(1));
	float v2 = dot(s2 / 9.0 - m2 * m2, vec3(1)), v3 = dot(s3 / 9.0 - m3 * m3, vec3(1));
	vec3 m = m0; float v = v0;
	if (v1 < v) { m = m1; v = v1; }
	if (v2 < v) { m = m2; v = v2; }
	if (v3 < v) { m = m3; }
	return m;
}

// Un livello: l'immagine con la sua vista, quanto è "bagnata" e il bordo del foglio.
vec4 livello(sampler2D t, vec2 dim, vec3 v, float bagnato, float marea) {
	vec2 uv = aUV(v);
	float texPerPx = dim.y / (uRes.y * v.z);          // texel per pixel di schermo
	float lod0 = log2(max(texPerPx, 1.0));

	// Il foglio: bordo sfrangiato come carta strappata a mano.
	vec2 bordo = min(uv, 1.0 - uv) * vec2(uAsp, 1.0);
	float sfr = (fbm(uv * 40.0) - 0.5) * 0.012;
	float dentro = smoothstep(0.0, 0.004, min(bordo.x, bordo.y) + sfr);
	if (dentro <= 0.0) return vec4(0.0);

	vec3 render = textureLod(t, uv, lod0).rgb;
	if (bagnato <= 0.001) return vec4(render, dentro);

	// Acquerello. La carta ondeggia un poco e sposta il pigmento.
	vec2 onda = (vec2(fbm(uv * 7.0 + 3.1), fbm(uv * 7.0 + 8.7)) - 0.5) * 0.006 * bagnato;
	vec2 uvw = uv + onda;
	vec2 passo = vec2(1.0 / uAsp, 1.0) * 5.0 / (uRes.y * v.z);
	float ang = fbm(uv * 9.0) * 6.2832;
	vec3 base = kuwahara(t, uvw, passo, lod0 + 2.0, ang);
	// L'acquerello è trasparente: si schiarisce il render e i chiari diventano carta.
	base = pow(base, vec3(0.7));
	float lb = lum(base);

	// Bordi: differenza fra due sfocature, il pigmento si accumula ai margini delle stese.
	float l1 = lum(textureLod(t, uvw, lod0 + 2.5).rgb);
	float l2 = lum(textureLod(t, uvw, lod0 + 4.5).rgb);
	float margine = smoothstep(0.02, 0.12, abs(l1 - l2));

	// Pigmento come assorbimento, con la granulazione che si deposita nelle valli della carta.
	vec3 pig = (1.0 - base) * 0.8;
	pig *= smoothstep(0.92, 0.6, lb);
	// Due pigmenti: terra di Siena nei mezzitoni, indaco nelle ombre (niente grigio fango).
	pig *= mix(vec3(0.9, 0.97, 1.1), vec3(1.04, 1.0, 0.92), smoothstep(0.25, 0.6, lb));
	float grana = fbm(uv * vec2(uAsp, 1.0) * 180.0);
	float fibra = noise(uv * vec2(uAsp * 700.0, 90.0));
	pig *= mix(1.0, 0.6 + 0.8 * grana, 0.45);
	pig *= 1.0 + margine * 0.7 + marea * 0.45;
	vec3 acq = (1.0 - clamp(pig, 0.0, 0.85)) * uCarta * (0.985 + 0.015 * fibra);

	return vec4(mix(render, acq, bagnato), dentro);
}

void main() {
	vec2 sc = gl_FragCoord.xy / uRes.y;

	// Asciugatura a chiazze: dove il rumore supera il livello, è ancora bagnato.
	float n = fbm(sc * 2.6 + 4.0);
	float d = uAsciutto * 1.25 - 0.12;
	float bagnato = smoothstep(d - 0.035, d + 0.035, n);
	float marea = exp(-pow((n - d) / 0.01, 2.0)) * step(0.001, uAsciutto) * step(uAsciutto, 0.999);

	vec4 a = livello(uA, uTA, uVA, bagnato, marea);
	o = vec4(mix(uCarta, a.rgb, a.a), 1.0);

	if (uTaglio > 0.0) {
		// Il taglio: la tavola successiva si posa sopra, allineata sul tavolo, con il suo
		// bordo sfrangiato e un'ombra; entra a chiazze d'acqua che si asciugano subito.
		float m = fbm(sc * 3.3 + 11.0);
		float f = 1.15 - uTaglio * 1.3;
		float dentroB = smoothstep(f + 0.05, f - 0.05, m);
		float fronte = exp(-pow((m - f) / 0.05, 2.0)) * (1.0 - uTaglio);
		vec4 b = livello(uB, uTB, uVB, clamp(fronte * 0.5, 0.0, 0.4), 0.0);
		// Ombra del foglio B sul foglio A: B spostato un poco in basso, sfocato a mano.
		vec2 uvb = aUV(uVB + vec3(0.0, -0.006, 0.0));
		vec2 bd = min(uvb, 1.0 - uvb) * vec2(uAsp, 1.0);
		float ombra = smoothstep(-0.02, 0.0, min(bd.x, bd.y)) * (1.0 - b.a) * 0.28;
		o.rgb *= 1.0 - ombra * dentroB;
		o.rgb = mix(o.rgb, b.rgb, b.a * dentroB);
	}
	o.rgb += (hash(gl_FragCoord.xy + uTempo) - 0.5) / 255.0; // dithering contro le bande
}
`;
