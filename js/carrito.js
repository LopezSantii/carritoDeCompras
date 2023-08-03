// user
let buttonUser = document.getElementById("user");
let modalUser = document.getElementById("modalBodyUser");
let modalUserFooter = document.getElementById("modalUserFooter");
let buttonRegister = document.createElement("button");
let modalUserHeader = document.getElementById("exampleModalLabe");
buttonRegister.classList.add("bg_button", "btn", "w-100");
modalUserFooter.append(buttonRegister);
let buttonCerrar = document.createElement("button");
buttonCerrar.innerHTML = "Cerrar sesion";
buttonCerrar.classList.add("bg_button", "btn","d-none");
modalUserFooter.append(buttonCerrar);

// validacion si el usuario ya esta iniciado
let usuario = {
    nombre: undefined,
    correo: undefined,
    contraseña: undefined,
    direccion: undefined,
    cp: undefined,
    ciudad: undefined,
    barrio: undefined,
};
let usuarioLocal = JSON.parse(localStorage.getItem("usuario"))

if (usuarioLocal === undefined || usuarioLocal === null) {
   usuario = {} 
} else {
    usuario = usuarioLocal
    buttonUser.children[1].innerHTML = `${usuario.nombre}`;  
} 

buttonUser.addEventListener("click", () => {
    if (usuario.nombre === undefined) {
        modalUserHeader.innerHTML = `Iniciar Sesion`;
        buttonCerrar.classList.add("d-none");
        modalUser.innerHTML = `
        <label>Nombre</label>
        <input class="mb-3" type="text">
        <label>Fecha de nacimiento</label>
        <input class="mb-3" type="date">
        <label>Correo electronico</label>
        <input class="mb-3" type="email">
        <label>Contraseña</label>
        <input class="mb-3" type="password" placeholder="contraseña">`
        let error = document.createElement("div");
        error.className = "text_error"
        modalUser.append(error);
        buttonRegister.classList.remove("d-none");
        buttonRegister.classList.add("w-100");
        buttonRegister.innerHTML = "Iniciar";

        buttonRegister.addEventListener("click", () => {
            error.innerHTML = "";
            // validacion de email
            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let email = false;

            if (regex.test(modalUser.children[5].value)) {
                modalUser.children[5].classList.remove("error");
                email = true;
            } else {
                modalUser.children[5].classList.add("error");
            }

            // validar contraseña
            let tieneMayuscula = /[A-Z]/;
            let tieneMinuscula = /[a-z]/;
            let tieneNumero = /\d/;
            let contraseña = false;

            if (tieneMayuscula.test(modalUser.children[7].value)
                && tieneMinuscula.test(modalUser.children[7].value)
                && tieneNumero.test(modalUser.children[7].value)) {
                modalUser.children[7].classList.remove("error");
                contraseña = true;
            } else {
                modalUser.children[7].classList.add("error");
            }

            // validacion de edad
            let fechaNacimiento = new Date(modalUser.children[3].value);
            let fechaActual = new Date();
            let edad = false;

            let edadMilisegundos = fechaActual - fechaNacimiento;
            let edadAños = Math.floor(edadMilisegundos / (1000 * 60 * 60 * 24 * 365.25));

            if (edadAños >= 18) {
                modalUser.children[3].classList.remove("error");
                edad = true;
            } else {
                modalUser.children[3].classList.add("error");
            }

            // validacion de nombre
            let nom = false;
            if (modalUser.children[1].value.length != 0) {
                modalUser.children[1].classList.remove("error");
                nom = true;
            } else {
                modalUser.children[1].classList.add("error");
            }

            if ((edad && contraseña && email && nom) === true) {
                // llenamos el objeto
                usuario.nombre = modalUser.children[1].value;
                usuario.correo = modalUser.children[5].value;
                usuario.contraseña = modalUser.children[7].value;

                let usuarioJson = JSON.stringify(usuario)
                localStorage.setItem("usuario", usuarioJson);

                // cerrar modal
                $("#modalUsuario").modal("hide");
                // notificar que se inicio secion
                Toastify({
                    text: "Sesion iniciada",
                    duration: 800,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "black",
                    },
                }).showToast();
                buttonUser.children[1].innerHTML = `${usuario.nombre}`;
                buttonCerrar.classList.remove("d-none");
            } else {
                error.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
                <p>Por favor complete correctamente los campos</p>`;

            }
        })
    } else if (usuario.direccion === undefined) {
        modalUserHeader.innerHTML = `Datos de Envio`;
        modalUser.innerHTML = `
        <label>Direccion</label>
        <input class="mb-3" type="text">
        <label>Barrio</label>
        <input class="mb-3" type="text">
        <label>Ciudad</label>
        <input class="mb-3" type="email">
        <label>Codigo Postal</label>
        <input class="mb-3" type="text">`

        buttonRegister.innerHTML = "Guardar";
        buttonRegister.classList.remove("w-100")
        buttonCerrar.classList.remove("d-none", "w-100");

        buttonRegister.addEventListener("click", () => {
            // validar direccion
            let tieneNumero = /\d/;
            let direccion = false;
            if (modalUser.children[1].value.length != 0 && tieneNumero.test(modalUser.children[1].value)) {
                modalUser.children[1].classList.remove("error");
                direccion = true;
            } else {
                modalUser.children[1].classList.add("error");
            }

            // validacio barrio
            let barrio
            if (modalUser.children[3].value.length != 0) {
                modalUser.children[3].classList.remove("error");
                barrio = true;
            } else {
                modalUser.children[3].classList.add("error");
            }

            // validacion ciudad
            let ciudad = false;
            if (modalUser.children[5].value.length != 0) {
                modalUser.children[5].classList.remove("error");
                ciudad = true;
            } else {
                modalUser.children[5].classList.add("error");
            }

            // validacion cp
            let codigo = false;
            if (modalUser.children[7].value.length === 4 && tieneNumero.test(modalUser.children[7].value)) {
                modalUser.children[7].classList.remove("error");
                codigo = true;
            } else {
                modalUser.children[7].classList.add("error");
            }

            if (codigo && barrio && direccion && ciudad) {
                usuario.direccion = modalUser.children[1].value;
                usuario.barrio = modalUser.children[3].value;
                usuario.ciudad = modalUser.children[5].value;
                usuario.cp = modalUser.children[7].value;

                let usuarioJson = JSON.stringify(usuario)
                localStorage.setItem("usuario", usuarioJson);
                // cerrar modal
                $("#modalUsuario").modal("hide");
                Toastify({
                    text: "Direccion guardada",
                    duration: 800,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "black",
                    },
                }).showToast();

            } else {
                // mensaje de error
                error.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                    <p>Por favor complete correctamente los campos</p>`;
            }

        })

    } else {
        // card direccion guardada
        modalUserHeader.innerHTML = `Datos de usuario`;
        buttonCerrar.classList.remove("d-none");
        buttonCerrar.classList.add("w-100");
        buttonRegister.classList.add("d-none");
        crearCardUser(modalUser, usuario.nombre, usuario.direccion, usuario.ciudad, usuario.barrio, usuario.cp)
    }
})

// cerra sesion
buttonCerrar.addEventListener("click", () => {
    localStorage.removeItem('usuario');
    usuario = {};
    Toastify({
        text: "Sesion cerrada",
        duration: 800,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "black",
        },
    }).showToast();
    // cerrar modal
    $("#modalUsuario").modal("hide");
    buttonUser.children[1].innerHTML = ``;
})


// Carrito de compras

// validar si hay productos ya guardados
let carrito = [];
let carritoLocal = JSON.parse(localStorage.getItem("carrito"));
if (carritoLocal === undefined || carritoLocal === null || carritoLocal.length === 0) {
    carrito = []
} else {
    carrito = carritoLocal
    Toastify({
        text: "Hay productos en el carrito ",
        duration: 1500,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "black",
        },
    }).showToast();
}


// recupero elementos del html
let shop = document.getElementById("contenedorItems");
let modalCarrito = document.getElementById("modal-body");
let buttonCarrito = document.getElementById("buttonCarrito");
let modalFooter = document.getElementById("modal_footer")
let cerrarModal = document.querySelector("#exampleModal");

//consumiendo api
function productos() {
    return fetch("../json/productos.json")
        .then(response => response.json())
        .then(data => {
            // crear tienda de productos
            let arrayDeItems = data
            arrayDeItems.forEach(sneakers => {
                let cont = document.createElement("div");
                cont.classList.add("col-lg-4", "col-md-6", "my-1");
                cont.innerHTML = `
                <a href="${sneakers.enlace}">
                    <img src="${sneakers.img}" class="card-img-top" alt="${sneakers.nombre}">
                </a>
                <div class="my-4">
                    <p class="w-100 button_snk">
                        ${sneakers.nombre}
                    </p>
                    <p class="w-100 button_snk">
                    $ ${sneakers.precio}
                    </p>
                </div>
            
            `;
                shop.append(cont);
            
                let buttonAgregar = document.createElement("button");
                buttonAgregar.innerHTML = "Agregar al carrito";
                buttonAgregar.classList.add("buttonCarrito", "btn", "bg_button");
                cont.children[1].append(buttonAgregar);

                buttonAgregar.addEventListener("click", () => {

                    // verificamos que el producto se repite en el carrito
                    let repeat = carrito.some((e) => e.id == carrito.id);
                    if (repeat) {
                        carrito.map((c) => {
                            if (c.id === carrito.id) {
                                // si se repite lo incrementamos la cantidad
                                c.cantidad++;
                            }
                        })
                    } else {
                        // si no esta lo agregamos
                       carrito.push({
                        nombre: sneakers.nombre,
                        img: sneakers.img,
                        precio: sneakers.precio,
                        enalce: sneakers.enalce,
                        cantidad: sneakers.cantidad
                    }); 
                    }

                    // notificaion de que el producto se agrego al carrito
                    Toastify({
                        text: "Producto agregado",
                        duration: 800,
                        newWindow: true,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "black",
                        },
                    }).showToast();
                        localStorage.setItem("carrito", JSON.stringify(carrito));
                })
                
            });
        })
        .catch(err => console.error(err))
}

productos();

// crear modal con productos y formularios de compra
buttonCarrito.addEventListener("click", () => {
    // suma de productos en el carrito
    let suma = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    modalFooter.innerHTML = `
    <p class="col-8" id="total">$ ${suma}</p> `
    // boton para comprar
    let buttonComprar = document.createElement("button");
    buttonComprar.classList.add("col-3","btn","bg_button");
    buttonComprar.innerHTML = "Comprar";
    modalFooter.append(buttonComprar);
    
    llenarCarrito(buttonComprar);
    buttonComprar.addEventListener("click", () => {

        if (usuario.direccion === undefined) {
            crearFormEnvio();
        } else {
            modalFooter.innerHTML = "";
            let buttonNuevosDatos = document.createElement("button");
            buttonNuevosDatos.classList.add("col-4", "btn", "bg_button");
            buttonNuevosDatos.innerHTML = "Nuevos datos";
            let buttonSiguente = document.createElement("button");
            buttonSiguente.classList.add("col-3", "btn", "bg_button");
            buttonSiguente.innerHTML = "Siguiente";
            modalFooter.append(buttonNuevosDatos, buttonSiguente);

            crearCardUser(modalCarrito, usuario.nombre, usuario.direccion, usuario.ciudad, usuario.barrio, usuario.cp)

            buttonNuevosDatos.addEventListener("click", crearFormEnvio);
            buttonSiguente.addEventListener("click", () => {
                modalCarrito.innerHTML = "";
                let formulario = document.createElement("form");
                modalCarrito.append(formulario)
                crearFormularioDeCompra(formulario)
            });
        }
    })
})


// funciones para rellenar los modales

function llenarCarrito() {
    // mensaje si el carrito esta vacio
    if (carrito.length === 0) {
        modalCarrito.innerHTML = `
        <svg class="mt-3" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <p class= "mt-3 my-center">El carrito esta vacio</p>`;
        modalFooter.innerHTML = ``;
    }else {
        modalCarrito.innerHTML = ``;
    }

    carrito.forEach((productos) => {
        let carritoCont = document.createElement("div");
        carritoCont.classList.add("itemCarrito", "container");
        carritoCont.innerHTML = `
            <img class"img-fluid" src="${productos.img}" alt="${productos.nombre}">
            <section>
                <h3 class"col-6">${productos.nombre}</h3>
                <div class"col-6">
                    <div>
                        <button id="res" class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                            </svg>
                        </button>
                        <p class="mx-auto">${productos.cantidad}</p>
                        <button id="sum" class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </button>
                    </div>
                    <p>$ ${productos.precio * productos.cantidad}</p>
                </div>
            </section>
        `;
        modalCarrito.append(carritoCont);

        let buttonSuma = document.getElementById("sum");

        buttonSuma.addEventListener("click", () => {
            carrito.map((element) => element.cantidad++)
            llenarCarrito();
        })

        let buttonResta = document.getElementById("res");

        buttonResta.addEventListener("click", () => {
            carrito.map((element) => element.cantidad > 1 ? element.cantidad--: borrarElementos)
            llenarCarrito();
        })

        let eliminarProducto = document.createElement("button");
        eliminarProducto.classList.add("btn");
        eliminarProducto.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
        </svg>`
        carritoCont.children[1].lastElementChild.append(eliminarProducto);

        eliminarProducto.addEventListener("click", borrarElementos);
    })

}

function borrarElementos(event) {
    let productId = event.target.parentElement.dataset.productId;
    let elementoEliminado = carrito.find((elemet) => elemet.id === productId);
    carrito = carrito.filter((carritoNew) => carritoNew != elementoEliminado);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    llenarCarrito();
}

function crearFormEnvio() {
    // formulario de envio del producto
    modalFooter.innerHTML = "";
    modalCarrito.innerHTML = "";
    let formulario = document.createElement("form");
    formulario.classList.add("formulario_envio","row","mx-1");
    formulario.innerHTML = `
    <div class="d-flex align-items-baseline">
        <h3 class="me-3">Datos personales</h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person"viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
        </svg>    
    </div>
    <label>Nombre</label>
    <input class="mb-3 col-12" type="text" >
    <label>Correo electronico</label>
    <input class="mb-3 col-12" type="email">
    <div class="d-flex align-items-baseline">
    <h3 class="me-3">Datos del envio</h3>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">
    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
    </svg>
    </div>
    <label>Direccion</label>
    <input class="mb-3 col-12">
    <label>Barrio</label>
    <input class="mb-3 col-12">
    <label>Ciudad</label>
    <input class="mb-3 col-12">
    <label>Codigo postal</label>
    <input class="mb-3 col-12">
    `;
    // boton para pasar al pago
    let buttonSiguiente = document.createElement("button");
    buttonSiguiente.innerHTML = "Siguiente";
    buttonSiguiente.classList.add("btn", "bg_button", "col-12", "mx-auto");
    modalFooter.append(buttonSiguiente);
    modalCarrito.append(formulario);
    let error = document.createElement("div");
    error.className = "text_error"
    
    validarFormEnvio(buttonSiguiente,error,formulario);
}

function validarFormEnvio(button, error, formulario) {

    button.addEventListener("click", () => {
        error.innerHTML = ``;

        // validar nombre
        let nombre = false;
        if (formulario.children[2].value.length != 0) {
            nombre = true;
            formulario.children[2].classList.remove("error");
        } else {
            formulario.children[2].classList.add("error");
        }

        // validacion de email
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let email = false;
        if (regex.test(formulario.children[4].value)) {
            email = true;
            formulario.children[4].classList.remove("error");
        } else {
            formulario.children[4].classList.add("error");
        }

        // validar direccion
        let tieneNumero = /\d/;
        let calle = false;
        if (formulario.children[7].value.length != 0 && tieneNumero.test(formulario.children[7].value)) {
            calle = true;
            formulario.children[7].classList.remove("error");
        } else {
            formulario.children[7].classList.add("error");
        }

        // validar barrio
        let barrio = false;
        if (formulario.children[9].value.length != 0) {
            barrio = true
            formulario.children[9].classList.remove("error");
        } else {
            formulario.children[9].classList.add("error");
        }

        // validar ciudad
        let ciudad = false;
        if (formulario.children[11].value.length != 0) {
            ciudad = true
            formulario.children[11].classList.remove("error");
        } else {
            formulario.children[11].classList.add("error");
        }

        // validar codigo postal
        let cp = false;
        if (formulario.children[13].value.length === 4 && tieneNumero.test(formulario.children[13].value)) {
            cp = true;
            formulario.children[13].classList.remove("error");
        } else {
            formulario.children[13].classList.add("error");
        }

        // si todo es correcto que pase al segundo formulario
        if (email && nombre && calle && barrio && ciudad && cp) {
            crearFormularioDeCompra(formulario);
        } else {
            error.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                    <p>Por favor complete correctamente los campos</p>`;
            formulario.append(error);
        }

    })
}

function crearFormularioDeCompra(formulario) { 
    // creando formulario de compra
    modalFooter.innerHTML = "";
    let selectMes = document.createElement("select");
    selectMes.classList.add("col-4");
    selectMes.innerHTML = `<option value="MM" disabled selected>MM</option>`;
    for (let index = 1; index < 12; index++) {
        let option = document.createElement("option");
        option.innerHTML = `${index}`;
        option.value = `${index}`;
        selectMes.append(option);
    }
    let selectAño = document.createElement("select");
    selectAño.classList.add("col-4", "mx-2");
    selectAño.innerHTML = `<option value="AA" disabled selected>AA</option>`;
    for (let index = 2023; index < 2063; index++) {
        let option = document.createElement("option");
        option.innerHTML = `${index}`;
        option.value = `${index}`;
        selectAño.append(option);
    }

    let contenedorFecha = document.createElement("div");
    contenedorFecha.innerHTML = `
    <p>Fecha de caducidad</p>
    `
    formulario.innerHTML = `
    <h3>Datos de la tarjeta</h3>
    <label>Numero</label>
    <input class="mb-3 col-12">
    <label>Nombre y Apellido como figura en la tarjeta</label>
    <input class="mb-3 col-12">
    <label>DNI del titular</label>
    <input class="mb-3 col-12"">
    <label>Codigo de seguridad</label>
    <input class="mb-3 col-12">`

    formulario.append(contenedorFecha);
    contenedorFecha.append(selectMes, selectAño);

    // crear boton para finalizar la compra
    let buttonFinalizar = document.createElement("button");
    buttonFinalizar.innerHTML = "Finalizar compra";
    buttonFinalizar.classList.add("btn", "bg_button", "col-12", "mx-auto");

    modalFooter.append(buttonFinalizar);

    buttonFinalizar.addEventListener("click", () => {

        let tieneNumero = /\d/;

        // verificar numero de tarjeta
        let tarjeta = false;
        if (formulario.children[2].value.length === 16 && tieneNumero.test(formulario.children[2].value)) {
            tarjeta = true;
            formulario.children[2].classList.remove("error");
        } else {
            formulario.children[2].classList.add("error");
        }

        // validar nombre y apellido del titular
        let nom = false;
        if (formulario.children[4].value != 0) {
            nom = true;
            formulario.children[4].classList.remove("error");
        } else {
            formulario.children[4].classList.add("error");
        }

        // validar documento
        let docu = false;
        if (formulario.children[6].value.length === 8 && tieneNumero.test(formulario.children[6].value)) {
            docu = true;
            formulario.children[6].classList.remove("error");
        } else {
            formulario.children[6].classList.add("error");
        }

        // validar codigo de seguridad
        let seg = false;
        if (formulario.children[8].value.length === 3 && tieneNumero.test(formulario.children[8].value)) {
            seg = true;
            formulario.children[8].classList.remove("error");
        } else {
            formulario.children[8].classList.add("error");
        }

        let fechaActual = new Date();
        let mesActual = fechaActual.getMonth() + 1;
        let fecha = false;
        console.log(selectMes.value);
        console.log(selectMes.value);
        if ((selectAño.value === "AA" || selectMes.value === "MM")||parseInt(selectAño.value) < fechaActual.getFullYear() || (parseInt(selectAño.value) === fechaActual.getFullYear() && parseInt(selectMes.value) < mesActual)) {
            selectAño.classList.add("error");
            selectMes.classList.add("error");
        } else {
            selectAño.classList.remove("error");
            selectMes.classList.remove("error");
            fecha = true;
        }

        if (fecha && seg && docu && nom && tarjeta) {
            // mensaje de compra exitosa
            $(cerrarModal).modal("hide");
            Swal.fire({
                title: "Compra exitosa",
                icon: "success",
                text: "Recibira un email con los datos del envio",
                confirmButton: "Aceptar",
            });

            // borramos los datos del local storage 
            localStorage.removeItem('carrito');
            carrito = [];
        }
    })
}

function crearCardUser(modal,nombre,direccion,ciudad,barrio,cp) {
    modal.innerHTML = `
    <div class="card">
        <div class="card-body">
            <p>Nombre: ${nombre}<p>
            <p class="card-text">Direccion: ${direccion}</p>
            <p class="card-text">Cuidad: ${ciudad}</p>
            <p class="card-text">Barrio: ${barrio}</p>
            <p class="card-text">Codigo podtal: ${cp}</p>
        </div>
    </div>`
}