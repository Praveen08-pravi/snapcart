import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.EMAIL_PASS; // Brevo API key
const SENDER_EMAIL = process.env.EMAIL_USER; // Verified sender email in Brevo
const LOGO_URL = "https://res.cloudinary.com/dipxchsu3/image/upload/v1778124602/Full-logo_a4lbgt.jpg";

// Test connection on startup
const testBrevoConnection = async () => {
  try {
    // Make a simple request to verify API key works
    await axios.get('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log("✅ Brevo email service is ready");
  } catch (error) {
    console.error("⚠️  Brevo connection warning:", error.response?.data?.message || error.message);
    // Don't block server startup if Brevo is unavailable
  }
};

// Test connection on startup (non-blocking)
testBrevoConnection();

const sendEmailViaBrevo = async (to, subject, html) => {
  try {
    const response = await axios.post(BREVO_API_URL, {
      sender: {
        name: "SnapCart",
        email: SENDER_EMAIL
      },
      to: [{
        email: to
      }],
      subject: subject,
      htmlContent: html
    }, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Email sent successfully:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.data || error.message);
    throw error;
  }
};

export const sendOTP = async (email, otp) => {
  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body style="
        margin:0;
        padding:0;
        background-color:#f3f4f6;
        font-family:Arial,sans-serif;
      ">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">

              <table width="500" cellpadding="0" cellspacing="0" style="
                width:100%;
                max-width:500px;
                background:#ffffff;
                border-radius:20px;
                overflow:hidden;
              ">

                <!-- Header -->
                <tr>
                  <td align="center" style="
                    background:#111827;
                    padding:35px 20px;
                  ">
                    <img
                      src="${LOGO_URL}"
                      alt="SnapCart"
                      width="180"
                      style="
                        display:block;
                        max-width:180px;
                        width:100%;
                      "
                    />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 35px;">

                    <h2 style="
                      margin:0;
                      color:#111827;
                      font-size:28px;
                    ">
                      Verify Your Account
                    </h2>

                    <p style="
                      margin-top:20px;
                      color:#4b5563;
                      font-size:15px;
                      line-height:26px;
                    ">
                      Use the OTP below to complete your SnapCart signup.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="
                      margin-top:30px;
                      background:#eff6ff;
                      border:2px dashed #2563eb;
                      border-radius:16px;
                    ">
                      <tr>
                        <td align="center" style="padding:24px;">
                          <span style="
                            font-size:36px;
                            font-weight:700;
                            letter-spacing:8px;
                            color:#2563eb;
                          ">
                            ${otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin-top:24px;
                      color:#6b7280;
                      font-size:14px;
                      line-height:24px;
                    ">
                      This OTP will expire in 10 minutes.
                    </p>

                    <p style="
                      margin-top:32px;
                      color:#111827;
                      font-size:15px;
                    ">
                      Thanks,<br/>
                      <strong>SnapCart Team</strong>
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

  try {
    await sendEmailViaBrevo(email, "Your OTP for SnapCart Signup", html);
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body style="
        margin:0;
        padding:0;
        background-color:#f3f4f6;
        font-family:Arial,sans-serif;
      ">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">

              <table width="500" cellpadding="0" cellspacing="0" style="
                width:100%;
                max-width:500px;
                background:#ffffff;
                border-radius:20px;
                overflow:hidden;
              ">

                <!-- Header -->
                <tr>
                  <td align="center" style="
                    background:#111827;
                    padding:35px 20px;
                  ">
                    <img
                      src="${LOGO_URL}"
                      alt="SnapCart"
                      width="180"
                      style="
                        display:block;
                        max-width:180px;
                        width:100%;
                      "
                    />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 35px;">

                    <h2 style="
                      margin:0;
                      color:#111827;
                      font-size:28px;
                    ">
                      Welcome to SnapCart 🎉
                    </h2>

                    <p style="
                      margin-top:24px;
                      color:#4b5563;
                      font-size:15px;
                      line-height:28px;
                    ">
                      Hi <strong>${name}</strong>,
                    </p>

                    <p style="
                      color:#4b5563;
                      font-size:15px;
                      line-height:28px;
                    ">
                      Your account has been created successfully.
                      You can now explore products, place orders,
                      and enjoy seamless shopping with SnapCart.
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" style="margin-top:30px;">
                      <tr>
                        <td align="center" bgcolor="#2563eb" style="
                          border-radius:14px;
                        ">
                          <a
                            href="https://snapcart-store.netlify.app"
                            style="
                              display:inline-block;
                              padding:14px 28px;
                              color:#ffffff;
                              text-decoration:none;
                              font-weight:600;
                              font-size:15px;
                            "
                          >
                            Start Shopping
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin-top:36px;
                      color:#111827;
                      font-size:15px;
                    ">
                      Thanks,<br/>
                      <strong>SnapCart Team</strong>
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

  await sendEmailViaBrevo(email, "Welcome to SnapCart!", html);
};

export const sendOrderConfirmationEmail = async (
  email,
  name,
  order,
  products,
  expectedDelivery
) => {
  const transactionId = order.paymentInfo.transactionId;

  const formattedDelivery = new Date(expectedDelivery).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const productRows = products
    .map(
      (product) => `
        <tr>
          <td style="
            padding:18px 0;
            border-bottom:1px solid #e5e7eb;
          ">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>

                <!-- Product Image -->
                <td width="95" valign="top">
                  <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="82"
                    style="
                      display:block;
                      border-radius:12px;
                      border:1px solid #e5e7eb;
                    "
                  />
                </td>

                <!-- Product Details -->
                <td valign="top" style="padding-left:14px;">

                  <p style="
                    margin:0;
                    font-size:16px;
                    font-weight:700;
                    color:#111827;
                    line-height:24px;
                  ">
                    ${product.name}
                  </p>

                  <p style="
                    margin:8px 0 0 0;
                    font-size:14px;
                    color:#6b7280;
                    line-height:22px;
                  ">
                    ${product.description}
                  </p>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-top:14px;"
                  >
                    <tr>

                      <td style="
                        font-size:14px;
                        color:#374151;
                      ">
                        Qty:
                        <strong>${product.quantity}</strong>
                      </td>

                      <td align="right" style="
                        font-size:17px;
                        font-weight:700;
                        color:#111827;
                      ">
                        ₹${(product.price || 0).toFixed(2)}
                      </td>

                    </tr>
                  </table>

                </td>

              </tr>
            </table>

          </td>
        </tr>
      `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f4f6;
  font-family:Arial,sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 20px;"
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            width:100%;
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background:#111827;
                padding:36px 20px;
              "
            >

              <img
                src="${LOGO_URL}"
                alt="SnapCart"
                width="190"
                style="
                  display:block;
                  max-width:190px;
                  width:100%;
                "
              />

              <p style="
                margin:18px 0 0;
                color:#d1d5db;
                font-size:15px;
              ">
                Order Confirmation
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="
                margin:0;
                color:#111827;
                font-size:28px;
              ">
                Thank You For Your Order 🎉
              </h2>

              <p style="
                margin-top:22px;
                color:#4b5563;
                font-size:15px;
                line-height:28px;
              ">
                Hi <strong>${name}</strong>,
              </p>

              <p style="
                color:#4b5563;
                font-size:15px;
                line-height:28px;
              ">
                Your payment was successful and your order has been confirmed.
                We’re preparing your items for shipment.
              </p>

              <!-- Order Summary -->
              <h2 style="
                margin-top:36px;
                margin-bottom:20px;
                color:#111827;
                font-size:24px;
              ">
                Order Summary
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${productRows}
              </table>

              <!-- Payment Details -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin-top:32px;
                  background:#f9fafb;
                  border-radius:16px;
                "
              >
                <tr>
                  <td style="padding:24px;">

                    <p style="
                      margin:0 0 14px;
                      font-size:14px;
                      color:#374151;
                    ">
                      <strong>Order ID:</strong>
                      ${order._id}
                    </p>

                    <p style="
                      margin:0 0 14px;
                      font-size:14px;
                      color:#374151;
                    ">
                      <strong>Transaction ID:</strong>
                      ${transactionId}
                    </p>

                    <p style="
                      margin:0 0 14px;
                      font-size:14px;
                      color:#374151;
                    ">
                      <strong>Payment Method:</strong>
                      ${order.paymentInfo.method}
                    </p>

                    <p style="
                      margin:0 0 14px;
                      font-size:14px;
                      color:#374151;
                    ">
                      <strong>Amount Paid:</strong>
                      ₹${order.paymentInfo.amountPaid.toFixed(2)}
                    </p>

                    <p style="
                      margin:0;
                      font-size:14px;
                      color:#374151;
                    ">
                      <strong>Expected Delivery:</strong>
                      ${formattedDelivery}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table
                cellpadding="0"
                cellspacing="0"
                style="margin-top:32px;"
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#2563eb"
                    style="border-radius:14px;"
                  >
                    <a
                      href="https://snapcart-store.netlify.app/myOrders"
                      style="
                        display:inline-block;
                        padding:14px 28px;
                        color:#ffffff;
                        text-decoration:none;
                        font-size:15px;
                        font-weight:600;
                      "
                    >
                      View My Orders
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <p style="
                margin-top:36px;
                color:#4b5563;
                font-size:15px;
                line-height:26px;
              ">
                If you have any questions, simply reply to this email.
              </p>

              <p style="
                margin-top:28px;
                color:#111827;
                font-size:15px;
              ">
                Thanks,<br />
                <strong>SnapCart Team</strong>
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  await sendEmailViaBrevo(email, 'Your SnapCart order is confirmed', html);
};

export const sendDeliveryConfirmationEmail = async (
  email,
  name,
  order,
  products
) => {
  const transactionId = order.paymentInfo.transactionId;

  const formattedDeliveryDate = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const productRows = products
    .map(
      (product) => `
        <tr>
          <td style="
            padding:18px 0;
            border-bottom:1px solid #e5e7eb;
          ">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>

                <!-- Product Image -->
                <td width="95" valign="top">
                  <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="82"
                    style="
                      display:block;
                      border-radius:12px;
                      border:1px solid #e5e7eb;
                    "
                  />
                </td>

                <!-- Product Details -->
                <td valign="top" style="padding-left:14px;">

                  <p style="
                    margin:0;
                    font-size:16px;
                    font-weight:700;
                    color:#111827;
                    line-height:24px;
                  ">
                    ${product.name}
                  </p>

                  <p style="
                    margin:8px 0 0 0;
                    font-size:14px;
                    color:#6b7280;
                    line-height:22px;
                  ">
                    ${product.description}
                  </p>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-top:14px;"
                  >
                    <tr>

                      <td style="
                        font-size:14px;
                        color:#374151;
                      ">
                        Qty:
                        <strong>${product.quantity}</strong>
                      </td>

                      <td align="right" style="
                        font-size:17px;
                        font-weight:700;
                        color:#111827;
                      ">
                        ₹${(product.price || 0).toFixed(2)}
                      </td>

                    </tr>
                  </table>

                </td>

              </tr>
            </table>

          </td>
        </tr>
      `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f4f6;
  font-family:Arial,sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 20px;"
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            width:100%;
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background:#111827;
                padding:35px 20px;
              "
            >
              <img
                src="${LOGO_URL}"
                alt="SnapCart"
                width="200"
                style="
                  display:block;
                  max-width:200px;
                  width:100%;
                "
              />
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:40px 35px;">

              <!-- Title -->
              <h1 style="
                margin:0 0 10px 0;
                color:#16a34a;
                font-size:32px;
                font-weight:700;
                text-align:center;
              ">
                ✓ Delivered!
              </h1>

              <p style="
                text-align:center;
                margin:0 0 28px 0;
                color:#6b7280;
                font-size:16px;
              ">
                Your order has been successfully delivered
              </p>

              <!-- Order Info Box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#f9fafb;
                  border-radius:14px;
                  margin-bottom:28px;
                "
              >
                <tr>
                  <td style="padding:24px;">

                    <p style="
                      margin:0 0 16px 0;
                      color:#111827;
                      font-size:15px;
                      font-weight:600;
                    ">
                      Hi ${name},
                    </p>

                    <p style="
                      margin:0 0 20px 0;
                      color:#4b5563;
                      font-size:15px;
                      line-height:26px;
                    ">
                      Great news! Your order has been delivered to your address on
                      <strong>${formattedDeliveryDate}</strong>.
                    </p>

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="margin-top:16px;"
                    >
                      <tr>
                        <td style="
                          font-size:13px;
                          color:#6b7280;
                          padding-bottom:12px;
                        ">
                          <strong>Order ID:</strong>
                        </td>
                        <td
                          align="right"
                          style="
                            font-size:13px;
                            color:#111827;
                            font-weight:600;
                            padding-bottom:12px;
                          "
                        >
                          #${order._id.toString().slice(-8).toUpperCase()}
                        </td>
                      </tr>
                      <tr>
                        <td style="
                          font-size:13px;
                          color:#6b7280;
                          padding-bottom:12px;
                        ">
                          <strong>Transaction ID:</strong>
                        </td>
                        <td
                          align="right"
                          style="
                            font-size:13px;
                            color:#111827;
                            font-weight:600;
                            padding-bottom:12px;
                          "
                        >
                          ${transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="
                          font-size:13px;
                          color:#6b7280;
                        ">
                          <strong>Total Amount:</strong>
                        </td>
                        <td
                          align="right"
                          style="
                            font-size:16px;
                            color:#111827;
                            font-weight:700;
                          "
                        >
                          ₹${order.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Items Section -->
              <p style="
                margin:32px 0 16px 0;
                color:#111827;
                font-size:16px;
                font-weight:700;
              ">
                Order Items
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${productRows}
              </table>

              <!-- Buttons -->
              <table
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="margin-top:32px;"
              >
                <tr>
                  <td align="center">
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      style="margin-bottom:14px;"
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#2563eb"
                          style="border-radius:14px;"
                        >
                          <a
                            href="https://snapcart-store.netlify.app/myOrders"
                            style="
                              display:inline-block;
                              padding:14px 28px;
                              color:#ffffff;
                              text-decoration:none;
                              font-size:15px;
                              font-weight:600;
                            "
                          >
                            View My Orders
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <p style="
                margin-top:36px;
                color:#4b5563;
                font-size:15px;
                line-height:26px;
              ">
                If you have any questions, simply reply to this email.
              </p>

              <p style="
                margin-top:28px;
                color:#111827;
                font-size:15px;
              ">
                Thanks,<br />
                <strong>SnapCart Team</strong>
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  await sendEmailViaBrevo(email, 'Your order has been delivered! 🎉', html);
};
