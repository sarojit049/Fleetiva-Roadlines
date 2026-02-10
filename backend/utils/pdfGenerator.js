const PDFDocument = require('pdfkit');

exports.generateBiltyPDF = (bilty, res) => {
  const doc = new PDFDocument({ margin: 30 });
  const copies = ['Consignor Copy', 'Consignee Copy', 'Driver Copy', 'Transport Copy'];

  copies.forEach((title, index) => {
    doc.fontSize(20).text('LOGISTICS BILTY', { align: 'center' });
    doc.fontSize(10).text(title, { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`LR No: ${bilty.lrNumber}`);
    doc.text(`Date: ${new Date(bilty.createdAt).toLocaleDateString()}`);
    doc.text(`Vehicle No: ${bilty.vehicleNumber}`);
    doc.text(`Driver: ${bilty.driverName} (${bilty.driverPhone})`);
    doc.text(`From: ${bilty.pickupLocation}`);
    doc.text(`To: ${bilty.dropLocation}`);
    doc.text(`Material: ${bilty.materialType}`);
    doc.text(`Weight: ${bilty.weight} Tons`);
    doc.text(`Truck Type: ${bilty.truckType}`);
    doc.text(`Consignor: ${bilty.consignorName}`);
    doc.text(`Consignee: ${bilty.consigneeName}`);
    doc.moveDown();
    doc.text('Freight Details');
    doc.text(`Freight Amount: Rs. ${bilty.freightAmount.toFixed(2)}`);
    doc.text(`Advance Paid: Rs. ${bilty.advancePaid.toFixed(2)}`);
    doc.text(`Balance Amount: Rs. ${bilty.balanceAmount.toFixed(2)}`);
    doc.text(`Payment Mode: ${bilty.paymentMode.toUpperCase()}`);
    doc.moveDown();
    doc.text('--------------------------------------------------');
    doc.text('Terms & Conditions: Goods carried at owner risk.');

    if (index < copies.length - 1) doc.addPage();
  });

  doc.pipe(res);
  doc.end();
};

exports.generateInvoicePDF = (booking, res) => {
  const doc = new PDFDocument({ margin: 50 });
  const total = booking.freightAmount + booking.gstAmount;

  doc.fontSize(20).text('GST INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice No: INV-${booking._id.toString().slice(-6).toUpperCase()}`);
  doc.text(`Customer: ${booking.customer.name}`);
  doc.text(`Route: ${booking.from} to ${booking.to}`);
  doc.moveDown();

  doc.text(`Base Amount: Rs. ${booking.freightAmount.toFixed(2)}`);
  doc.text(`GST (12%): Rs. ${booking.gstAmount.toFixed(2)}`);
  doc.text('-----------------------------------');
  doc.fontSize(14).text(`Total Payable: Rs. ${total.toFixed(2)}`, { bold: true });

  doc.pipe(res);
  doc.end();
};
