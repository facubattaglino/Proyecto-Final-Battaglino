// Array de productos
let productos = [
  {id: 1, categoria: "perfumeria mujer", nombre: "Attraction ", precio: 8580, rutaImagen: "images/blueattraction.jpg", stock: 5},
  {id: 2, categoria: "perfumeria mujer", nombre: "Rare Flowers ", precio: 6270, rutaImagen: "images/Rareflowers.jpg", stock: 8},
  {id: 3, categoria: "perfumeria mujer", nombre: "Pur Blanca ", precio: 3110, rutaImagen: "images/purblanca.jpg", stock: 3},
  {id: 4, categoria: "perfumeria hombre", nombre: "Attraction para él ", precio: 11070, stock: 2, rutaImagen: "images/atracttionparael.jpg"},
  {id: 5, categoria: "perfumeria hombre", nombre: "300Km/h ", precio: 6050, stock: 3, rutaImagen: "images/300km.jpg"},
  {id: 6, categoria: "perfumeria hombre", nombre: "Maxime ", precio: 13100, stock: 9, rutaImagen: "images/maxime.jpg"},
 
  {id: 7, categoria: "maquillaje", nombre: "Paleta de sombras ", precio: 3200, stock: 6, rutaImagen: "images/paletaSombra.jpg"},
  {id: 8, categoria: "maquillaje", nombre: "Delineadores retráctiles ", precio: 1435, stock: 8, rutaImagen: "images/delineador.jpg"},
  {id: 9, categoria: "maquillaje", nombre: "Pinturas de uñas ", precio: 1200, stock: 4, rutaImagen: "images/pinturauñas.jpg"},
  {id: 10, categoria: "maquillaje", nombre: "Labiales ", precio: 730, stock: 3, rutaImagen: "images/labiales.jpg"},
 
  {id: 11, categoria: "cuidado personal", nombre: "Cremas faciales ", precio: 3600, stock: 5, rutaImagen: "images/cremafacial.jpg"},
  {id: 12, categoria: "cuidado personal", nombre: "Mascarillas faciales ", precio: 860, stock: 7, rutaImagen: "images/mascarillafacial.jpg"},
  {id: 13, categoria: "cuidado personal", nombre: "Locion corporal ", precio: 2600, stock: 1, rutaImagen: "images/locion.jpg"},
  {id: 14, categoria: "cuidado personal", nombre: "Cremas de manos ", precio: 590, stock: 6, rutaImagen: "images/cremademanos.jpg"},
  
  {id: 15, categoria: "ofertas", nombre: "Pinturas de uñas ", precio: 600, stock: 10, rutaImagen: "images/ofertauno.jpg"},
  {id: 16, categoria: "ofertas", nombre: "Individual Blue ", precio: 5600, stock: 10, rutaImagen: "images/ofertados.jpg"},
  {id: 17, categoria: "ofertas", nombre: "Trakking Avon ", precio: 700, stock: 10, rutaImagen: "images/ofertatres.jpg"},
]
let contenedorProducto = document.getElementById('contenedorProducto')
let contenedorCarrito = document.getElementById('contenedorCarrito')
let cartItems = document.getElementById('cart-items')
let messageContainer = document.getElementById('message-container')
let finalizarCompraButton = document.getElementById('finalizar-compra')

//evento para buscar productos por input
let searchButton = document.getElementById('search-button')
let searchInput = document.getElementById('search-input')
searchButton.addEventListener('click', buscarProductos)

// Función para generar botones de categorías
function generarBotonesCategorias() {
  let categorias = [...new Set(productos.map(producto => producto.categoria))]
  let categoriesContainer = document.querySelector('.categories')

  categorias.forEach(categoria => {
    let button = document.createElement('button')
    button.classList.add('category-btn')
    button.textContent = categoria
    button.dataset.category = categoria
    categoriesContainer.appendChild(button)
  })
}
// Función para mostrar los productos de una categoría
function mostrarProductos(categoria) {
  contenedorProducto.innerHTML = ''

  let productosMostrados
  if (categoria === 'todos') {
    productosMostrados = productos.slice(); // Copiamos el array original
  } else {
    productosMostrados = productos.filter(producto => producto.categoria === categoria)
  }

  productosMostrados.forEach(producto => {
    let div = document.createElement('div')
    div.classList.add('product')

    let imagen = document.createElement('img')
    imagen.src = producto.rutaImagen
    div.appendChild(imagen)

    let nombre = document.createElement('span')
    nombre.textContent = producto.nombre
    div.appendChild(nombre)

    let precio = document.createElement('span')
    precio.textContent = `$ ${producto.precio}`
    div.appendChild(precio)


    let boton = document.createElement('button')
    boton.textContent = 'Agregar al carrito'
    boton.disabled = producto.stock === 0 // Desactivamos el botón si el stock es cero
    boton.addEventListener('click', () => agregarAlCarrito(producto))
    div.appendChild(boton)

    contenedorProducto.appendChild(div)
  })
}
// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito()
  let index = productos.findIndex(item => item.id === producto.id)

  if (index !== -1 && productos[index].stock > 0) {
    productos[index].stock--

    let productoEnCarrito = carrito.find(item => item.id === producto.id)
    if (productoEnCarrito) {
      if (productoEnCarrito.stock > 0) {
        productoEnCarrito.stock++
      } else {
        Swal.fire('Producto agotado', 'Ya no hay más stock disponible de este producto.', 'error')
        return
      }
    } else {
      carrito.push({ ...producto, stock: 1 })
    }

    guardarCarrito(carrito)
    mostrarCarrito()
    actualizarEstadoBotonFinalizarCompra()
    mostrarMensaje('Producto agregado al carrito.')
  } else {
    Swal.fire('Producto agotado', 'Ya no hay más stock disponible de este producto.', 'error')
  }
}
// Función para obtener los productos del carrito desde el LocalStorage
function obtenerCarrito() {
  let carritoString = localStorage.getItem('carrito')
  return carritoString ? JSON.parse(carritoString) : []
}
// Función para guardar los productos del carrito en el LocalStorage
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}
// Función para eliminar un producto del carrito
function eliminarDelCarrito(producto) {
  let carrito = obtenerCarrito()
  let indice = carrito.findIndex(item => item.id === producto.id)

  if (indice !== -1) {
    carrito.splice(indice, 1)
    guardarCarrito(carrito)
    mostrarCarrito()
    mostrarMensaje('Producto eliminado del carrito.')
  }
}
// Función para buscar productos
function buscarProductos() {
  let searchTerm = searchInput.value.toLowerCase().trim()

  if (searchTerm === '') {
    mostrarProductos('todos')
    return
  }

  let resultados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm)
  )

  if (resultados.length === 0) {
    contenedorProducto.innerHTML = '<p>No se encontraron productos con el término de búsqueda.</p>'
    return
  }

  contenedorProducto.innerHTML = ''

  resultados.forEach(producto => {
    let div = document.createElement('div')
    div.classList.add('product')

    let imagen = document.createElement('img')
    imagen.src = producto.rutaImagen
    div.appendChild(imagen)

    let nombre = document.createElement('span')
    nombre.textContent = producto.nombre
    div.appendChild(nombre)

    let precio = document.createElement('span')
    precio.textContent = `$ ${producto.precio}`
    div.appendChild(precio)

    let boton = document.createElement('button')
    boton.textContent = 'Agregar al carrito'
    boton.addEventListener('click', () => agregarAlCarrito(producto))
    div.appendChild(boton)

    contenedorProducto.appendChild(div)
  })
}
// Funcion mostrar carrito
function mostrarCarrito() {
  let carrito = obtenerCarrito()
  cartItems.innerHTML = ''

  carrito.forEach(producto => {
    let div = document.createElement('div')
    div.classList.add('cart-item')

    let nombre = document.createElement('span')
    nombre.textContent = producto.nombre
    div.appendChild(nombre)

    let cantidad = document.createElement('span')
    cantidad.textContent = `Cantidad: ${producto.stock}`
    div.appendChild(cantidad)

    let precio = document.createElement('span')
    precio.textContent = `$ ${producto.precio}`
    div.appendChild(precio)

    let botonEliminar = document.createElement('button')
    botonEliminar.textContent = 'Eliminar'
    botonEliminar.addEventListener('click', () => eliminarDelCarrito(producto))
    div.appendChild(botonEliminar)

    cartItems.appendChild(div)
  })

    // Mostrar el total del carrito
    let totalCarrito = calcularTotalCarrito(carrito)
    let totalElement = document.createElement('p')
    totalElement.textContent = `Total del carrito: $ ${totalCarrito}`
    cartItems.appendChild(totalElement)
  }
  //Funcion para calcular el total del carrito
  function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(producto => {
      total += producto.precio * producto.stock;
    });
    return total;
  }
// Función para mostrar mensajes en el DOM
function mostrarMensaje(mensaje) {
  let mensajeElement = document.createElement('p')
  mensajeElement.textContent = mensaje
  messageContainer.appendChild(mensajeElement)

  setTimeout(() => {
    mensajeElement.remove()
  }, 3000)
}
// Evento para mostrar todos los productos al cargar la página
window.addEventListener('load', () => {
  mostrarProductos('todos')
  mostrarCarrito()
})
// Evento para generar los botones de categorías
generarBotonesCategorias()
// Evento para mostrar los productos de la categoría seleccionada
let categoryButtons = document.querySelectorAll('.category-btn')
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    let category = button.dataset.category
    mostrarProductos(category)
  })
})

// Evento para finalizar la compra...
finalizarCompraButton.addEventListener('click', () => {
  let carrito = obtenerCarrito()
  if (carrito.length === 0) {
    Swal.fire('¡El carrito está vacío!', 'Agrega productos al carrito antes de finalizar la compra.', 'warning')
  } else {
    finalizarCompra()
      .then(() => {
        fetch('https://ejemplo.com/compra-finalizada', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Compra finalizada' }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
  }
})

// Función para finalizar compra...
function finalizarCompra() {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: '¿Deseas finalizar la compra?',
      text: 'Una vez finalizada la compra, no podrás agregar más productos al carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario aceptó finalizar la compra
        setTimeout(() => {
          const carrito = obtenerCarrito()
          carrito.length = 0 // Vaciamos el carrito
          guardarCarrito(carrito)
          mostrarCarrito()
          mostrarMensaje('Compra finalizada. Ya no puedes agregar más productos al carrito.')
          resolve()
        }, 500) // Simulamos medio segundo de espera
      }
    })
  })
}