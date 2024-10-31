function exibeProd(id) {
  var el = document.querySelector("#prod-" + id);
  el.classList.toggle("d-none");
}

// Restricts input for the set of matched elements to the given inputFilter function.
(function ($) {
  $.fn.inputFilter = function (inputFilter) {
    return this.on(
      "input keydown keyup mousedown mouseup select contextmenu drop",
      function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      }
    );
  };
})(jQuery);

function testeEvent() {
  console.log("working");
}

$(document).ready(function () {
  var secoes = ["#secao-1", "#secao-2", "#secao-3"];
  var index_secao = 0;

  $("input[name='nf_compra']").inputFilter(function (value) {
    return /^\d*$/.test(value);
  });

  $(".change_section").click(function () {
    var action = $(this).data("tipo");

    const transporte = $("#transporte-input").val();
    const email = $("#email").val();
    const filial = $("#filial_id").val();
    const uf = $("#transporte-uf-input").val();
    const cidade = $("#transporte-cidade-input").val();

    if (transporte == "" || transporte == null) {
      alert("Campo Transporte é obrigatório.");
      return false;
    }

    if (transporte == 1) {
      if (uf == "" || uf == null) {
        alert("Campo UF é obrigatório.");
        return false;
      }

      if (cidade == "") {
        alert("Campo Cidade é obrigatório.");
        return false;
      }
    }

    if (filial == "" || filial == null) {
      alert("Campo Filial Barros onde comprou é obrigatório.");
      return false;
    }

    if (email == "") {
      alert("Campo Email é obrigatório.");
      return false;
    }

    if (action === "next") {
      index_secao = index_secao < 2 ? ++index_secao : index_secao;
      $(".secoes").hide();
      $(secoes[index_secao]).show();
      $("#prev").prop("disabled", false);
      if (index_secao == 1) {
        $("#next").hide();
        $("#enviar_pedido").show();
      }
    } else {
      index_secao = index_secao > 0 ? --index_secao : index_secao;
      $(".secoes").hide();
      $("#enviar_pedido").hide();
      $("#next").show();
      $(secoes[index_secao]).show();
      if (index_secao == 0) {
        $("#prev").prop("disabled", true);
      }
    }
  });

  $(".change_section_ressarcimento").click(function () {
    var action = $(this).data("tipo");

    const transporte = $("#transporte-input").val();
    const email = $("#email").val();
    const filial = $("#filial_id").val();
    const uf = $("#transporte-uf-input").val();
    const cidade = $("#transporte-cidade-input").val();

    if (transporte == "" || transporte == null) {
      alert("Campo Transporte é obrigatório.");
      return false;
    }

    if (transporte == 1) {
      if (uf == "" || uf == null) {
        alert("Campo UF é obrigatório.");
        return false;
      }

      if (cidade == "") {
        alert("Campo Cidade é obrigatório.");
        return false;
      }
    }

    if (filial == "" || filial == null) {
      alert("Campo Filial Barros onde comprou é obrigatório.");
      return false;
    }

    if (email == "") {
      alert("Campo Email é obrigatório.");
      return false;
    }

    if (action === "next") {
      index_secao = index_secao < 2 ? ++index_secao : index_secao;
      $(".secoes").hide();
      $(secoes[index_secao]).show();
      $("#prev").prop("disabled", false);
      if (index_secao == 2) {
        $("#next").hide();
        $("#enviar_pedido").show();
      }
    } else {
      index_secao = index_secao > 0 ? --index_secao : index_secao;
      $(".secoes").hide();
      $("#enviar_pedido").hide();
      $("#next").show();
      $(secoes[index_secao]).show();
      if (index_secao == 0) {
        $("#prev").prop("disabled", true);
      }
    }
  });

  $(".mostrar_devolucao_form").click(async function () {
    var garantia_id = $(this).data("garantia-id");
    var response = await $.ajax({
      url: "garantia-e-devolucao/get-nota-devolucao/" + garantia_id,
      method: "get",
      dataType: "json",
    });
    if (!response.status) {
      $("#nf_devolucao").val(response.nf_devolucao);
      $("#data_emissao").val(response.data_emissao);
    }
    console.log(response);
    $("#montar_pedido").hide();
    $("#secao-nota-devolucao").show();
    $("#garantida_id_form").val(garantia_id);
  });

  $(".salvar_produto").click(async function (ev) {
    ev.preventDefault();
    item = {};
    var input = "";
    var tr = "";
    var vazio = false;
    var tipo = $("#montar_pedido input[name=tipo]").val();
    $("#nenhum_produto").remove();
    if ($("#ressarcimento").is(":checked")) {
      if ($("#lista_produtos tr").length > 0) {
        alert("A opção de Ressarcimento permite apenas um produto na lista");
        return false;
      }
    }

    let cod_barros = "";
    $("#montar_pedido .produto").each(function () {
      var name = $(this).attr("name");
      var val = $(this).val();

      if (name == "cod_barros") {
        cod_barros = val;
        if (val.match(/^[0-9]+$/) == null) {
          alert("O campo Cód. Barros só pode conter números");
          vazio = true;
          return false;
        }
      }

      if (val == "") {
        alert("Todos os campos são obrigatórios");
        vazio = true;
        return false;
      }
      item[name] = val;
    });

    const response = await $.ajax({
      url: "garantia-e-devolucao/check-codigo/" + cod_barros,
      method: "get",
      dataType: "json",
    });

    if (response?.status == 404) {
      alert("O Código Barros informado não foi encontrado na base de dados");
      vazio = true;
    }

    if (vazio) {
      return false;
    }

    if (
      $("#montar_pedido").hasClass("ressarcimento-form") &&
      $("#lista_produtos tr").length > 0
    ) {
      alert(
        "A opção de ressarcimento não permite mais de um produto. Deixe apena um produto na lista e clique em Ressarcimento"
      );
      return false;
    }

    if (
      $("#montar_pedido input[name=motivo]:checked").val() === undefined &&
      !$("#montar_pedido").hasClass("ressarcimento-form")
    ) {
      alert("Escolha um motivo");
      return false;
    } else {
      item["motivo"] = $("#montar_pedido input[name=motivo]:checked").val();
      if (
        item["motivo"] == 7 &&
        $("#montar_pedido .outro_textarea").val() == ""
      ) {
        alert("Descreva o motivo");
        return false;
      } else {
        if ($("#montar_pedido .outro").val() == "") {
          item["outro"] = "";
        } else {
          item["outro"] = $("#montar_pedido .outro_textarea").val();
        }
      }

      if (item["motivo"] == 4) {
        item["descricao_defeito"] = $(
          "#montar_pedido textarea[name=descricao_defeito]"
        ).val();
        item["cupom_venda"] = $("#montar_pedido input[name=cupom_venda]").val();
        item["cupom_venda_data"] = $(
          "#montar_pedido input[name=cupom_venda_data]"
        ).val();
        item["data_cupom_fiscal"] = $(
          "#montar_pedido input[name=data_cupom_fiscal]"
        ).val();
        if (item["tipo_avaria"] == 2) {
          if (
            item["descricao_defeito"] == "" ||
            item["cupom_venda_data"] == "" ||
            item["cupom_venda_data"] == ""
          ) {
            return false;
          }
        }
      }

      if ($("#montar_pedido.garantia-form")) {
        item["data_cupom_fiscal"] = $(
          "#montar_pedido input[name=data_cupom_fiscal]"
        ).val();
        item["descricao_defeito"] = $(
          "#montar_pedido textarea[name=descricao_defeito]"
        ).val();
      }
    }

    var tr_id = $("#lista_produtos tr").length;

    item["motivo"] = $("input[name=motivo]:checked").val();
    if (!$("#montar_pedido").hasClass("garantia-form")) {
      $("input[name=motivo]").attr("checked", false);
      $(".avaria_opcoes").val("");
    }
    $(".produto").val("");

    input =
      "<input type='hidden' name='produtos[]' value='" +
      JSON.stringify(item) +
      "'>";
    tr =
      "<tr class='produto-item' id='produto-" +
      tr_id +
      "'><td>" +
      item.cod_barros +
      "</td><td>" +
      item.quantidade +
      "</td><td><a href='#' class='btn red editar_produto'>Editar</a> <a href='#' class='btn red excluir_produto'>Excluir</a></td>" +
      input +
      "</tr>";

    $("[name=descricao_defeito]").val("");
    $("[name=data_cupom_fiscal]").val("");
    $("#montar_pedido input[name=tipo]").val(tipo);
    $("#lista_produtos").append(tr);

    return false;
  });

  $(document).on("click", ".editar_produto", function () {
    var tr = $(this).closest("tr");
    var dados = JSON.parse(tr.find("input").val());
    console.log(dados);
    dados["id"] = tr.attr("id");

    $(".modal").remove();

    $.post(
      "garantia_devolucao/editar_produto",
      dados,
      function (html) {
        $(
          '<div class="modal fade" tabindex="-1" role="basic" aria-hidden="true">' +
            html +
            "</div>"
        ).modal();
      },
      "html"
    );

    return false;
  });

  $(document).on("click", "#salvar_editar_produto", function () {
    var array_produtos = jQuery("#formulario_editar_produto").serializeArray();
    var produto = {};
    for (var i = 0; i < array_produtos.length; i++) {
      produto[array_produtos[i]["name"]] = array_produtos[i]["value"];
    }
    console.log(produto);
    var input =
      "<input type='hidden' name='produtos[]' value='" +
      JSON.stringify(produto) +
      "'>";
    var id = $("#id_tr").val();
    var tr =
      "<td>" +
      produto.cod_barros +
      "</td><td>" +
      produto.quantidade +
      "</td><td><a href='#' class='btn red editar_produto'>Editar</a> <a href='#' class='btn red excluir_produto'>Excluir</a></td>" +
      input +
      "</tr>";

    $(".modal").modal("hide");
    $("#" + id).html(tr);

    return false;
  });

  $(document).on("click", ".excluir_produto", function () {
    var tr = $(this).closest("tr");
    tr.remove();
    return false;
  });

  $(document).on("change", ".devolucao_prazo", function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();

    var data_campo = $(this).val().split("/");

    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(data_campo[2], data_campo[1] - 1, data_campo[0]);
    var secondDate = new Date(yyyy, mm, dd);

    var diferencaEmDias = Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );

    var diferencaEmAnos = diferencaEmDias / 365.25;

    if(diferencaEmAnos > 5) {
      alert("Atenção! Não é permitido adicionar notas fiscais com datas maiores do que 5 anos.");
      $(this).val("");
      $(this).focus();
      return false;
    }

    if (diferencaEmDias > 7) {
      alert("Essa solicitação está acima dos 7 dias de prazo e estará sujeita a análise");
      return false;
    }
  });

  $("#garantia_nota_form").submit(function (ev) {
    const arquivoTipo = $("#arquivo").val().substr(-4);
    if (arquivoTipo != ".pdf" && arquivoTipo != ".PDF") {
      ev.preventDefault();
      alert("O formato do arquivo precisa ser .pdf");
      $(".loader-container").hide();
    }
  });

  $(document).on("change", ".garantia_prazo", function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();

    var data_campo = $(this).val().split("/");

    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(data_campo[2], data_campo[1] - 1, data_campo[0]);
    var secondDate = new Date(yyyy, mm, dd);

    var diferencaEmDias = Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );

    var diferencaEmAnos = diferencaEmDias / 365.25;

    if(diferencaEmAnos > 5) {
      alert("Atenção! Não é permitido adicionar notas fiscais com datas maiores do que 5 anos.");
      $(this).val("");
      $(this).focus();
      return false;
    }

    /*
    if (diferencaEmDias > 180) {
      alert(
        "O prazo da garantia concedido pelos fornecedores é de 6 meses a partir da data de venda do produto."
      );
      $(this).val("");
      $(this).focus();
      return false;
    }
    */
  });

  $(document).on("change", ".garantia_prazo_cupom", function () {
    var dia = 24 * 60 * 60 * 1000;

    var data_campo = $(this).val().split("/");
    var firstDate = new Date(data_campo[2], data_campo[1] - 1, data_campo[0]);

    var data_nf_compra = $('input[name="nf_compra_data"]').val().split("/");
    var secondDate = new Date(
      data_nf_compra[2],
      data_nf_compra[1] - 1,
      data_nf_compra[0]
    );

    var diferenca = Math.round(
      (firstDate.getTime() - secondDate.getTime()) / dia
    );

    if (diferenca < 0) {
      alert(
        "O prazo da garantia não pode ser anterior a nota fiscal de compra."
      );
      $(this).val("");
      return false;
    }
  });

  // $(document).on('change', '.ressarcimento_prazo', function(){

  //   var today = new Date();
  //   var dd = today.getDate();
  //   var mm = today.getMonth();
  //   var yyyy = today.getFullYear();

  //   var data_campo = $(this).val().split('/');

  //   var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  //   var firstDate = new Date(data_campo[2],data_campo[1]-1,data_campo[0]);
  //   var secondDate = new Date(yyyy,mm,dd);

  //   var diferenca = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  //   if(diferenca > 180){
  //     alert('A Nota Fiscal de Compra excede o prazo de 6 meses do Ressarcimento!');
  //     $(this).val('');
  //     return false;
  //   }

  // });

  $(document).on("change", 'input[name|="quantidade"]', function () {
    // console.log()
    var qtd = $(this).val();
    if (qtd < 1) {
      alert("Insira a quantidade corretamente");
      $(this).val("");
      return false;
    }
  });

  $(document).on("click", "input[name='motivo']", function () {
    if ($(this).hasClass("avaria")) {
      $(".avaria_opcoes").fadeIn();
    } else {
      $(".avaria_opcoes").fadeOut();
      $(".descricao_defeito").fadeOut();
    }

    var div_grupo = $(this).closest(".form-group");
    var outro_descricao = div_grupo.find(".outro_descricao");

    if ($(this).hasClass("outro")) {
      $(outro_descricao).fadeIn();
    } else {
      $(outro_descricao).fadeOut();
    }
  });

  $(document).on("change", ".tipo_avaria", function () {
    var div_grupo = $(this).closest(".motivo_avaria");
    var descricao_defeito = div_grupo.find(".descricao_defeito");
    if ($(this).val() == 2) {
      descricao_defeito.fadeIn();
    } else {
      descricao_defeito.fadeOut();
    }
  });

  $(".visualizar_pedido").click(function () {
    var href = $(this).attr("href");

    $(".modal").remove();

    $.get(
      href,
      function (html) {
        $(
          '<div class="modal fade" tabindex="-1" role="basic" aria-hidden="true">' +
            html +
            "</div>"
        ).modal();
      },
      "html"
    );

    return false;
  });

  $("#ressarcimento").click(function () {
    var msg =
      "Você selecionou a opção de RESSARCIMENTO. Este formato de devolução permite o ressarcimento de apenas 01 peça por chamado (01 ressarcimento por nota fiscal). Caso você tenha outras devoluções ou ressarcimentos, será necessário a abertura de um novo chamado. Se deseja continuar clique em “OK” e continue preenchendo os próximos campos";
    if ($(this).is(":checked")) {
      /*  if($("#lista_produtos tr").length > 1){
        alert('A opção de ressarcimento não permite mais de um produto. Deixe apena um produto na lista e clique em Ressarcimento');
        return false;
      }
      $("#ressarcimento_arquivo").fadeIn(); */
      alert(msg);
      $(".ressarcimento_input").prop("disabled", false);
    } else {
      //$("#ressarcimento_arquivo").fadeOut();
      $(".ressarcimento_input").prop("disabled", true);
    }
  });

  // $('.money-unitario').maskMoney( { prefix:'R$ ', allowNegative: true } );
});
