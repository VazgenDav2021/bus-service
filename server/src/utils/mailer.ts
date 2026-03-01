import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { config } from '../config.js';

function isMailConfigured(): boolean {
  return Boolean(
    config.mail.host &&
      config.mail.port &&
      config.mail.user &&
      config.mail.pass &&
      config.mail.from
  );
}

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.port === 465,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

export async function sendStudentQrEmail(input: {
  to: string;
  studentName: string;
  studentId: string;
  qrToken: string;
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn('SMTP-ը կարգավորված չէ։ Ուսանողի QR նամակի ուղարկումը բաց է թողնվում։');
    return false;
  }

  const scanUrl = `${config.appBaseUrl}/scan?token=${input.qrToken}`;
  const qrBuffer = await QRCode.toBuffer(scanUrl, {
    type: 'png',
    margin: 1,
    width: 320,
  });

  await transporter.sendMail({
    from: config.mail.from,
    to: input.to,
    subject: 'Ձեր ուսանողի ավտոբուսի QR կոդը',
    text: `Բարև ${input.studentName},

Ձեր ուսանողական տեղափոխման QR կոդը ստեղծվել է։

Ուսանողի ID՝ ${input.studentId}
QR Token՝ ${input.qrToken}
Սկանավորման հղում՝ ${scanUrl}

Խնդրում ենք պահել այս QR կոդը գաղտնի և ներկայացնել այն ավտոբուս մուտք գործելիս։`,
    html: `
      <p>Բարև ${input.studentName},</p>
      <p>Ձեր ուսանողական տեղափոխման QR կոդը ստեղծվել է։</p>
      <p><strong>Ուսանողի ID՝</strong> ${input.studentId}</p>
      <p><strong>QR Token:</strong> ${input.qrToken}</p>
      <p>Խնդրում ենք ներկայացնել այս QR-ը ավտոբուս մուտք գործելիս։</p>
      <p><img src="cid:student-qr" alt="Ուսանողի QR կոդ" /></p>
      <p>Սկանավորման հղում՝ <a href="${scanUrl}">${scanUrl}</a></p>
    `,
    attachments: [
      {
        filename: `student-${input.studentId}-qr.png`,
        content: qrBuffer,
        cid: 'student-qr',
      },
    ],
  });

  return true;
}
