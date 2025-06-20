async function getOrcaWhirlpoolList() {
  const url = 'https://api.orca.so/v1/whirlpool/list';
  const response = await fetch(url);
  const data = await response.json();
  // Print all pool names or filter as needed
  console.log(data);
}

getOrcaWhirlpoolList();
