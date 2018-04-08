FROM kinlan/puppets:latest

# Copy the app
#COPY local.conf /etc/fonts/local.conf
WORKDIR app

RUN npm install -g yarn

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn

COPY . /app/

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules

# Run everything after as non-privileged user.
USER pptruser

ENV NODE_ENV=production
EXPOSE 8084
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start"]
