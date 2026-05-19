from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    database_url: str

    jwt_secret_key: str
    jwt_expiration_minutes: int = 60

    @property
    def jwt_algorithm(self) -> str:
        return "HS256"


settings = Settings()
