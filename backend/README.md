# Backend part

## Dependencies
```sh
$ pip install -r requirements.txt
```

## Configuration
Backend:
Path variable "DJANTO_SETTINGS_MODULE" is required, it links to a settings file.
Every developer has to have his own settings file and store in the repo.
Use postactivate script in virtualenv to set these settings

```sh
$ cat ~/.Envs/pdl/bin/postactivate
#!/bin/zsh
export DJANGO_SETTINGS_MODULE="backend.your_file"
cd /path_to_project/backend
```

```
### Database
```sh
CREATE DATABASE db_name;
CREATE USER user_name WITH password ‘password‘;
GRANT ALL ON DATABASE db_name TO user_name;
```

### Run
```sh
$ python manage.py runserver
```
