FROM python:3.9-slim

ARG DJANGO_SECRET_KEY


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
RUN apt-get update && apt-get install


RUN apt-get install -y \
  dos2unix \
  libpq-dev \
  libmariadb-dev-compat \
  libmariadb-dev \
  gcc \
  && apt-get clean
RUN pip install --upgrade pip

COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt
COPY . /code/

EXPOSE 8000
CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000", "--settings=identitysql.settings" ]