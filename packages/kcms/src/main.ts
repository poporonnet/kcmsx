/*
KCMS - Matz葉ガニロボコン 大会運営支援ツール
(C) 2023-2024 Poporon Network & Other Contributors
MIT License.
*/
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { basicAuth } from 'hono/basic-auth';
import { except } from 'hono/combine';
import { deleteCookie, setSignedCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { jwt, sign } from 'hono/jwt';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { matchHandler } from './match/main';
import { sponsorHandler } from './sponser/main';
import { teamHandler } from './team/main.js';

export type Env = {
  NODE_ENV?: 'development' | 'production';
  KCMS_ADMIN_USERNAME: string;
  KCMS_ADMIN_PASSWORD: string;
  KCMS_COOKIE_TOKEN_KEY: string;
  KCMS_CLIENT_URL: string;
};

const jwtSecret = await crypto.subtle.generateKey(
  {
    name: 'ECDSA',
    namedCurve: 'P-256',
  },
  true,
  ['sign', 'verify']
);
const cookieSecret = crypto.getRandomValues(new Uint32Array(8));

const app = new Hono();

app.use('*', (c, next) => {
  const { KCMS_CLIENT_URL: clientUrl } = env<Env>(c);
  return cors({
    origin: ['http://localhost:5173', clientUrl],
    credentials: true,
  })(c, next);
});
app.use(trimTrailingSlash());
app.use(secureHeaders());
app.get(
  '/login',
  (c, next) => {
    const { KCMS_ADMIN_USERNAME: username, KCMS_ADMIN_PASSWORD: password } = env<Env>(c);
    return basicAuth({ username, password })(c, next);
  },
  async (c) => {
    const { NODE_ENV: nodeEnv, KCMS_COOKIE_TOKEN_KEY: cookieKey } = env<Env>(c);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const ageSeconds = 60 * 5; // 5 minutes

    const token = await sign(
      {
        sub: 'admin',
        iss: 'kcms',
        iat: nowSeconds,
        exp: nowSeconds + ageSeconds,
      },
      jwtSecret.privateKey,
      'ES256'
    );
    await setSignedCookie(c, cookieKey, token, cookieSecret, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: ageSeconds,
      expires: new Date((nowSeconds + ageSeconds) * 1000),
      sameSite: 'strict',
      prefix: nodeEnv === 'production' ? 'host' : undefined,
    });
    return c.newResponse(null, 200);
  }
);
app.get('/logout', async (c) => {
  const { KCMS_COOKIE_TOKEN_KEY: cookieKey } = env<Env>(c);
  deleteCookie(c, cookieKey);
  return c.newResponse(null, 200);
});
app.use(
  '*',
  except(['/login', '/logout'], (c, next) => {
    const { NODE_ENV: nodeEnv, KCMS_COOKIE_TOKEN_KEY: cookieKey } = env<Env>(c);
    return jwt({
      secret: jwtSecret.publicKey,
      cookie: {
        key: cookieKey,
        secret: cookieSecret,
        prefixOptions: nodeEnv === 'production' ? 'host' : undefined,
      },
      alg: 'ES256',
    })(c, next);
  })
);
app.onError((err) => {
  if (!(err instanceof HTTPException)) {
    throw err;
  }

  const response = err.getResponse();
  if (response.status == 401 && response.headers.get('www-authenticate')?.startsWith('Basic')) {
    response.headers.set('www-authenticate', 'KCMS-Basic');
  }

  return response;
});

app.get('/', (c) => c.json({ message: 'kcms is up' }));
app.route('/', teamHandler);
app.route('/', matchHandler);
app.route('/', sponsorHandler);

// ToDo: config packageのTS読み込み問題により、一時的にBunで直接TSを実行する形に変更した
export default {
  port: 3000,
  fetch: app.fetch,
};
