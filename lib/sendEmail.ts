import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendOrderConfirmationEmail(to: string, orderDetails: any) {
  const msg = {
    to,
    from: 'your-email@example.com', // Replace with your verified sender
    subject: 'Order Confirmation',
    text: `Thank you for your order! Your order number is ${orderDetails.$id}.`,
    html: `<strong>Thank you for your order!</strong><br>Your order number is ${orderDetails.$id}.`,
  };

  try {
    await sgMail.send(msg);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}