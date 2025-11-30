FROM node:20-slim

WORKDIR /frontend

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]