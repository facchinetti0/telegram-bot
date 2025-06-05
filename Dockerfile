# Usa l'immagine base di Node.js (Alpine per immagini più leggere)
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia il file package.json e package-lock.json per l'installazione delle dipendenze
COPY package*.json ./

# Installa le dipendenze di produzione
RUN npm install --production

# Copia tutto il resto del progetto nella directory di lavoro
COPY . .

# Imposta la variabile d'ambiente per il port
ENV PORT=3000

# Espone la porta su cui il server Express sarà in ascolto
EXPOSE 3000

# Comando per avviare il bot e il server Express insieme
CMD ["node", "index.js"]
