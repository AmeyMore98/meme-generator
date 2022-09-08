export ENV="developement";
export NODE_ENV="development";
export POSTGRES_MEME_READ_WRITE="postgresql://root@localhost:5432/meme";

node_modules/.bin/nyc --clean node spec.js --seed=1234
