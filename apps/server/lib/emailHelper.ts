const sgMail = require('@sendgrid/mail');

// stripe trigger payment_intent.succeeded
// stripe listen --forward-to localhost:3001/api/orders

sgMail.setApiKey(process.env.RESEND_DYNAMIC_TEMPLATE_API);

export async function sendContactUsForm(contact) {
  const msg = {
    to: 'info@usetroptix.com',
    from: 'info@usetroptix.com',
    subject: `Contact Us Form Submission`,
    text: contact.message,
    html: `<div>Email: ${contact.email}</div><div>Message: ${contact.message}</div>`,
  };

  return await sgMail.send(msg);
}

export async function sendEmailToUser(order, orderMap) {
  const templateData = {
    id: order.id,
    eventTitle: order.event.name,
    subtotal: order.subtotal,
    totalFees: order.fees,
    totalPrice: order.total,
    username: order.firstName + ' ' + order.lastName,
    cardType: order.cardType,
    cardLast4: order.cardLast4,
    ticketsPurchased: order.tickets.length,
    ticketsLink: order?.ticketsLink,
    orderNumber: String(order.id),
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    orders: Array.from(orderMap.values()),
  };

  const msg = {
    to: order.email,
    from: {
      name: 'TropTix',
      email: 'info@usetroptix.com',
    },
    subject: 'TropTix Confirmation',
    templateId: 'd-658d88a06f0b443ca36d12d5e47e9275',
    dynamicTemplateData: templateData,
  };

  return await sgMail.send(msg);
}

export async function sendComplementaryTicketEmailToUser(order, orderMap) {
  const templateData = {
    id: order.id,
    eventTitle: order.eventName,
    orderNumber: order.id,
    orderDate: new Date().toLocaleDateString(),
    ticketsLink: order?.ticketsLink,
    orders: Array.from(orderMap.values()),
  };

  const msg = {
    to: order.email,
    from: {
      name: 'TropTix',
      email: 'info@usetroptix.com',
    },
    subject: 'TropTix Confirmation',
    templateId: 'd-925a204fa5b7431db20d7fe93e8d7ec0',
    dynamicTemplateData: templateData,
  };

  return await sgMail.send(msg);
}
