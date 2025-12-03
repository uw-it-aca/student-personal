function formatMailingAddress(data) {
  let address = "";
  if (data.address_line_1) {
    address += data.address_line_1;
  }
  if (data.address_line_2) {
    address += "<br/>" + data.address_line_2;
  }
  if (data.city) {
    address += "<br/>" + data.city;
  }
  if (data.state) {
    address += ", " + data.state;
  }
  if (data.zip_5) {
    address += "&nbsp;&nbsp;" + data.zip_5;
  }
  if (data.zip_5 && data.postal_cd) {
    address += "-" + data.postal_cd;
  }
  return address;
}

export { formatMailingAddress };
