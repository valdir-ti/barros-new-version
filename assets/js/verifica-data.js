function verifica()
{
var campo = $("input[name='nascimento']").val();
   if (campo!="")
{
		erro=0;
		hoje = new Date();
		anoAtual = hoje.getFullYear();
		barras = campo.split("/");
		if (barras.length == 3)
		{
				dia = barras[0];
				mes = barras[1];
				ano = barras[2];
				resultado = (!isNaN(dia) && (dia > 0) && (dia < 32)) && (!isNaN(mes) && (mes > 0) && (mes < 13)) && (!isNaN(ano) && (ano.length == 4) && (ano <= anoAtual && ano >= 1900));
				if (!resultado)
				{
						alert("Data inválida.");
						//campo.focus();
						return false;
				}
		 }
		 else
		 {
				 alert("Data inválida.");
				 //campo.focus();
				 return false;
		 }
return true;
}
}
