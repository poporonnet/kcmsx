const jwtSecret = await crypto.subtle.generateKey(
  {
    name: 'ECDSA',
    namedCurve: 'P-256',
  },
  true,
  ['sign', 'verify']
);
const privateJwk = await crypto.subtle.exportKey('jwk', jwtSecret.privateKey);
const publicJwk = await crypto.subtle.exportKey('jwk', jwtSecret.publicKey);

const cookieSecret = Buffer.from(crypto.getRandomValues(new Uint32Array(8))).toString('base64');

console.info(
  `KCMS_COOKIE_SECRET="${cookieSecret}"\nKCMS_AUTH_PRIVATE_JWK='${JSON.stringify(privateJwk)}'\nKCMS_AUTH_PUBLIC_JWK='${JSON.stringify(publicJwk)}'`
);
