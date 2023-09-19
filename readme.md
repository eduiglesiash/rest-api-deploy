# REST API

Rest es una arquitectura de software. 2000 - Roy Fielding

Como toda arquitectura responde a estos 6 fundamentos  
  - Escalabilidad
  - Simplicidad
  - Visibilidad
  - Fácil de modificar
  - Fiabilidad
  - Portabilidad


Y se sustenta en estos principios

    - Resources => Cada recurso se identifica con una URL 
    - Verbos HTTP => Para definir las opreciones que se puede realizar con los recursos
    - Representaciones => JSON, XML, HMLT, etc. El cliente debería poder decidir la representación del recurso
    - StateLess => El cliente debe enviar toda la información necesara para procesar la request 
    - Interfaz uniforme => La api siempre tiene que llamarse igual. 
    - Separación de conceptos. => Permite que cliente y servidor evoluciones de forma separada