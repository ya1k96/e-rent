# e-rent
 <img src="./public/images/icons/eRent144x144.png" />

Este proyecto tiene como fin llevar el control de alquileres o rentas. Mantener al tanto al usuario de proximos vencimientos, generar recibos y enviarlos por correo, etc.
Como aun esta en pañales, las funciones estan siendo tratadas, codificadas e implementadas.

## Vista de registro
 <img src="./docs/images/registerView.png"/>

## Vista del login
 <img src="./docs/images/loginview.png"/>

Utilizo middlewares para restringir el acceso a posibles intrusos. Para acceder, implemente con firebase un sistema de loggeo rapido con google(en revision) y otro con usuario y contraseña.

## Vista inical
 <img src="./docs/images/homeview.JPG"/>
 <img src="./docs/images/homeview-mobile.JPG"/>
La vista inicial pretende dar accesibilidad, dejando a la mano funciones especificas. 
(Algunas vistas y funciones siguen tratandose)

# Vista inquilinos
 <img src="./docs/images/inquilinosview.JPG"/>
 <img src="./docs/images/inquilinosview-mobile.JPG"/>

# Vista perfil inquilino
 <img src="./docs/images/inquilinoView.JPG"/>

# Vista de Facturas
 <img src="./docs/images/invoicesView.JPG"/>


## Formulario de registro de contrato/inquilino
 <img src="./docs/images/newcontract.JPG"/>
 <img src="./docs/images/newcontract-mobile.JPG"/>


# Vista de la factura generada
Detalle: La factura se genera automaticamente, implementando agenda. 
 <img src="./docs/images/invoicedetailview.JPG"/>
 <img src="./docs/images/invoicedetailview-mobile.JPG"/>

## Recibo en formato .pdf
Para crear el documento simplemente uso pdfkit, y los guardo en el storage de firebase. 
Detall: el enlace solo es valido por 60 minutos.
 <img src="./docs/images/paymentfile.JPG"/>
