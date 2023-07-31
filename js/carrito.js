// user
let buttonUser = document.getElementById("user");
let modalUser = document.getElementById("modalBodyUser");
let modalUserFooter = document.getElementById("modalUserFooter");
let buttonRegister = document.createElement("button");
let modalUserHeader = document.getElementById("exampleModalLabe");
buttonRegister.innerHTML = "Iniciar";
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

// Carrito de compras

// validar si hay productos ya guardados
let carrito = [];
let carritoLocal = JSON.parse(localStorage.getItem("carrito"));
if (carritoLocal === undefined || carritoLocal === null) {
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
                    carrito.push({
                        nombre: sneakers.nombre,
                        img: sneakers.img,
                        precio: sneakers.precio,
                        enalce: sneakers.enalce,
                    });

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
                    let carritoJson = JSON.stringify(carrito)
                    localStorage.setItem("carrito", carritoJson);
                })
                
            });
        })
        .catch(err => console.error(err))
}

productos();

// crear modal con productos y formularios de compra
buttonCarrito.addEventListener("click", () => {
    
    // mensaje si el carrito esta vacio
    carrito.length === 0 ? modalCarrito.innerHTML = `<p class= "my-center">El carrito esta vacio</p>` : modalCarrito.innerHTML = ``;
    
    carrito.forEach((productos) => {
        let carritoCont = document.createElement("div");
        carritoCont.classList.add("itemCarrito", "container");
        carritoCont.innerHTML = `
            <img class"img-fluid" src="${productos.img}" alt="${productos.nombre}">
            <div class"col-6">
                <h3>${productos.nombre}</h3>
                <p>$ ${productos.precio}</p>
            </div>
        `;
        modalCarrito.append(carritoCont);
    })
    
    // suma de productos en el carrito
    let suma = carrito.reduce((acc, el) => acc + el.precio, 0);
    modalFooter.innerHTML = `
    <p class="col-8" id="total">$ ${suma}</p> `
    // boton para comprar
    let buttonComprar = document.createElement("button");
    buttonComprar.classList.add("col-3","btn","bg_button");
    buttonComprar.innerHTML = "Comprar";
    modalFooter.append(buttonComprar);
    if (carrito.length === 0) buttonComprar.disabled = true;

    buttonComprar.addEventListener("click", () => {

        // formulario de envio del producto
        modalFooter.innerHTML = "";
        modalCarrito.innerHTML = "";
        let formulario = document.createElement("form");
        formulario.classList.add("formulario_envio","row","mx-1");
        formulario.innerHTML = `
        <h3>Datos personales</h2>
        <label>Nombre</label>
        <input class="mb-3 col-12" type="text" >
        <label>Correo electronico</label>
        <input class="mb-3 col-12" type="email">
        <h3>Datos del envio</h2>
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
            
        buttonSiguiente.addEventListener("click", () => {        
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
            if(regex.test(formulario.children[4].value)){
                email = true;
                formulario.children[4].classList.remove("error"); 
            }else {
                formulario.children[4].classList.add("error"); 
            }   

            // validar calle
            let calle = false;
            if (formulario.children[7].value.length != 0) {
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
            if (formulario.children[13].value.length === 4) {
                cp = true;
                formulario.children[13].classList.remove("error");
            } else {
                formulario.children[13].classList.add("error");  
            } 

            // si todo es correcto que pase al segundo formulario
            if (email && nombre && calle && barrio && ciudad && cp) {
                
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
                selectAño.classList.add("col-4","mx-2");
                selectAño.innerHTML = `<option value="AA" disabled selected>AA</option>`;
                for (let index = 23; index < 63; index++) {
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
                buttonFinalizar.classList.add("btn", "bg_button", "col-12","mx-auto");
    
                modalFooter.append(buttonFinalizar);
    
                buttonFinalizar.addEventListener("click", () => {

                    // verificar numero de tarjeta
                    let tarjeta = false;
                    if (formulario.children[2].value.length === 16) {
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
                    if (formulario.children[6].value.length === 8) {
                        docu = true;
                        formulario.children[6].classList.remove("error");
                    } else {
                        formulario.children[6].classList.add("error");
                    }

                    // validar codigo de seguridad
                    let seg = false;
                    if (formulario.children[8].value.length === 3) {
                        seg = true;
                        formulario.children[8].classList.remove("error");
                    } else {
                        formulario.children[8].classList.add("error");
                    }

                    // validiar la fecha de expiración con la fecha actual
                    let fechaActual = new Date();
                    let mesActual = fechaActual.getMonth() + 1;
                    let fecha = false;

                    if (parseInt(selectAño).value < fechaActual.getFullYear() || (parseInt(selectAño).value === fechaActual.getFullYear() && parent(selectMes).value < mesActual) ) {
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
                    })

                    // borramos los datos del local storage 
                    localStorage.removeItem('carrito');
                    carrito = [];  
                    }
                })
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
    

    })
})


buttonUser.addEventListener("click", () => {
    if (usuario.nombre === undefined) {
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
        buttonRegister.classList.remove("d.none");
        
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
        modalUserHeader.innerHTML= `Domicilio`;
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
        buttonCerrar.classList.remove("d-none");

        buttonRegister.addEventListener("click", () => {
            // validar direccion
            let direccion = false;
            if (modalUser.children[1].value.length != 0) {
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
            if (modalUser.children[7].value.length === 4) {
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
                error.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                    <p>Por favor complete correctamente los campos</p>`;
            }
            
        })

    } else {
        modalUserHeader.innerHTML = `Datos de usuario`;
        buttonCerrar.classList.remove("d-none");
        buttonRegister.classList.add("d-none");
        modalUser.innerHTML = `
            <p>Usuario : ${usuario.nombre}</p>
            <p>Email : ${usuario.correo}</p>
            <p>Direccion : ${usuario.direccion}</p>
            <p>Ciudad : ${usuario.ciudad}</p>
            <p>Barrio : ${usuario.barrio}</p>
            `
    }
})

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