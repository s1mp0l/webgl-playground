precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    // Если альфа > 0.9 - используем текстуру, иначе используем цвет из vColor
    gl_FragColor = vColor.a > 0.9 ? texture2D(uSampler, vTextureCoord) : vec4(vColor.rgb, 1.0);
}