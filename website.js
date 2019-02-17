var tableEtablissement = document.getElementById("tableEtablissement");


const button_c = document.querySelector('#compute');

 button_c.addEventListener('click', function onClick () {
	 
	if(tableEtablissement.rows.length == 1)
		{
			for (var i=0;i<test.length;i++)
			{
				var row = tableEtablissement.insertRow(i+1);
				var hotel_Name = row.insertCell(0);
				var postal_Code = row.insertCell(1);
				var chef = row.insertCell(2);
				var price = row.insertCell(3);
				hotel_Name.textContent = test[i].hotelName;
				postal_Code.innerHTML = test[i].postalCode;
				chef.innerHTML = test[i].chef;
				price.textContent = test[i].price;

			}
	 }
    return;
 });

const button_l = document.querySelector('#load');

button_l.addEventListener('click', function onClick () {
	 
	
    return;
 });