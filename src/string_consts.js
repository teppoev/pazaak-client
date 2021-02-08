const strings = {
    Header: {
        NavbarBrand: "Пазаак",
        UnauthenticatedNavbarCollapse: {
            Login: "Вход",
            Signup: "Регистрация"
        },
        AuthenticatedNavbarCollapse: {
            Play: "Играть",
            Rules: "Правила",
            Shop: "Магазин",
            Top: "Рекорды",
            Profile: "Профиль",
            Logout: "Выход"
        }
    },
    Content: {
        UnauthenticatedRoutes: {
            UnauthenticatedHome: {
                Join: "Присоединиться",
                Rules: "Правила"
            },
            Login: {
                Username: "Имя пользователя",
                Password: "Пароль",
                Login: "Войти"
            },
            Signup: {
                Username: "Имя пользователя",
                Password: "Пароль",
                ConfirmPassword: "Подтвердите пароль",
                Email: "Адрес электронной почты",
                Signup: "Зарегистрироваться",
                CheckEmailMessage: "Для подтверждения адреса электронной почты перейдите по ссылке, " +
                    "отправленной на Ваш почтовый ящик.\nПосле подтверждения Вы сможете войти в свой аккаунт."
            }
        },
        AuthenticatedRoutes: {
            AuthenticatedHome: {
                Text: "Дом, когда войдено"
            },
            Profile: {
                SaveDeckButton: {
                    Save: "Сохранить"
                },
                CleanDeckButton: {
                    Clean: "Очистить"
                }
            },
            Play: {
                Text: "Играть можно будет здесь"
            },
            Shop: {

            },
            Top: {
                Sharp: "#",
                Username: "Имя пользователя",
                Rating: "Рейтинг"
            },
            Loading: {
                Loading: "Загрузка..."
            }
        },
        Rules: {
            Rules: "Играть нужно вот так вот!"
        },
        NotFound: {
            NotFound: "Sorry, page not found!"
        }
    }
}

export default strings;