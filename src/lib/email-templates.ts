const baseEmailStyles = `
  body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; padding: 24px; }
  .card { border: 1px solid; border-radius: 6px; padding: 16px; }
  .title { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
  .text { font-size: 14px; line-height: 1.6; }
  .button { display: inline-block; text-decoration: none; padding: 8px 12px; border: 1px solid; border-radius: 4px; font-size: 14px; font-weight: 600; margin-top: 12px; }
  .muted { font-size: 12px; margin-top: 10px; }
`;

const wrapEmail = (title: string, body: string) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${baseEmailStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="title">${title}</div>
        <div class="text">${body}</div>
      </div>
    </div>
  </body>
</html>
`;

export const resetPasswordEmail = (url: string) =>
    wrapEmail(
        "Reset your password",
        `Click the button below to reset your password.<br />
        <a class="button" href="${url}">Reset password</a>
        <div class="muted">If you didn’t request this, you can safely ignore this email.</div>`
    );

export const deleteAccountEmail = (url: string) =>
    wrapEmail(
        "Confirm account deletion",
        `Click the button below to confirm account deletion.<br />
        <a class="button" href="${url}">Delete account</a>
        <div class="muted">This action cannot be undone.</div>`
    );

export const verifyEmailTemplate = (url: string) =>
    wrapEmail(
        "Verify your email",
        `Welcome to Spectrum! Please verify your email before logging in.<br />
    <a class="button" href="${url}">Verify email</a>
    <div class="muted">If you didn’t create an account, you can ignore this email.</div>`
    );
