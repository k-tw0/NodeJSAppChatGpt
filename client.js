
$(document).ready(function() {
  // Obtener el último dato y mostrarlo en el menú
  $.ajax({
    type: 'GET',
    url: '/datos',
    success: function(response) {
      console.log(response);
      if (response.datos) {
        const datos = response.datos;
        const listaDatos = $('#lista-datos');
        listaDatos.empty();
        datos.forEach(function(dato) {
          listaDatos.append('<li><a>' + dato + '</a></li>');
        });
      }
    },
    error: function(error) {
      console.log(error);
    }
});


  $('#enviar').on('click', function() {
   const dato = $('#dato').val(); // Obtener el valor del campo de texto
    $.ajax({
     type: 'POST',
     url: '/procesar',
     data: { dato: dato },
      success: function(response) {
        console.log(response);
        $('#resultado').html(response); // Mostrar la respuesta en el HTML
      
        // Agregar el nuevo elemento a la lista
        $('#lista-datos').prepend('<li><a>' + dato + '</a></li>');
     },
     error: function(error) {
       console.log(error);
     }
    });
  });
});

