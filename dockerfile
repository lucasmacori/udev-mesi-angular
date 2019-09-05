FROM angular/ngcontainer
WORKDIR ./app
COPY ./ ./app
RUN npm install
RUN ng serve --port 4200
EXPOSE 4200