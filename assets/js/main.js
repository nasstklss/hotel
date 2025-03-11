const host = 'http://server.vippo.ru/api';

const app = Vue.createApp({
    data() {
        return {
            page: 'control',
            loginForm: {
                login: 'admin',
                password: 'admin',
            },
            controlForm: {
                controlApplications: [],
                controlManager: [],
                controlPrice: [],
            },
            addManagerForm: {
                name: null,
                surname: null,
                patronymic: null,
                login: null,
                password: null,
                photo_file: null,
            },
            bookingCreateForm: {
                arr_date: null,
                dep_date: null,
                room_category_id: null,
                email: null,
                phone: null,
                city: null,
                guests: [
                    {
                        name: null,
                        surname: null,
                        patronymic: null,
                        birthday: null,
                        gender: null,
                        document_type_id: null,
                        document_number: null,
                    },
                ],
            },
            calculationValueForm: {
                arr_date: null,
                dep_date: null,
                room_category_id: null,
            },
            createPriceForm: {
                room_category_id: null,
                value: null,
                start_date: null,
            },
            editPriceForm: {
                value: null
            },
            category: [],
            categoryOne: [],
            booking: [],
            user_token: localStorage.getItem('user_token'),
        }
    },
    methods: {
        // Функция для открытия страницы
        openPage(page) {
            this.page = page;
        },

        // Вход
        login() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "login": this.loginForm.login,
                "password": this.loginForm.password,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/login`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.table(result);
                    localStorage.setItem('user_token', result.data.user_token);
                    this.user_token = localStorage.getItem('user_token');

                    this.openPage('main');
                })
                .catch((error) => console.error(error));
        },

        // Выход
        logout() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            // const raw = "";

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                // body: raw,
                redirect: "follow"
            };

            fetch(`${host}/logout`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.table(result);
                    localStorage.removeItem('user_token');
                    this.openPage('login');
                })
                .catch((error) => console.error(error));
        },

        // Управление заявками на бронирование
        controlApplicationsFunc() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${host}/booking`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.table(result);
                    this.controlForm.controlApplications = result;
                })
                .catch((error) => console.error(error));
        },

        controlManagerFunc() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${host}/user`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.controlForm.controlManager = result;
                })
                .catch((error) => console.error(error));
        },

        controlPrice() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${host}/price`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.controlForm.controlPrice = result;
                })
                .catch((error) => console.error(error));
        },

        // Добавление менеджера
        addManager() {
            const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const formdata = new FormData();
            formdata.append("name", this.addManagerForm.name);
            formdata.append("surname", this.addManagerForm.surname);
            formdata.append("patronymic", this.addManagerForm.patronymic);
            formdata.append("login", this.addManagerForm.login);
            formdata.append("password", this.addManagerForm.password);
            formdata.append("photo_file", this.$refs.photo_file.files[0]);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            fetch(`${host}/user`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);

                    this.addManagerForm = {
                        name: null,
                        surname: null,
                        patronymic: null,
                        login: null,
                        password: null,
                        photo_file: null,
                    };

                    this.controlManagerFunc();
                    this.openPage('control');
                })
                .catch((error) => console.error(error));
        },

        // Увольнение менеджера
        fireManager(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            // const raw = ""; | без этих срок работает

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                // body: raw, | без этих строк работает
                redirect: "follow"
            };

            fetch(`${host}/user/${id}/to-dismiss`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);

                    this.controlManagerFunc();
                    // this.openPage('control');
                })
                .catch((error) => console.error(error));
        },

        // Заявка на бронирование номера
        bookingPage(code) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            // const raw = "";

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                // body: raw,
                redirect: "follow"
            };

            fetch(`${host}/booking/${code}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    this.booking = result;
                    this.openPage('booking');
                })
                .catch((error) => console.error(error));
        },

        // Создание заявки на бронирование
        bookingCreate() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const guest = this.bookingCreateForm.guests[0];

            const raw = JSON.stringify({
                arr_date: this.bookingCreateForm.arr_date,
                dep_date: this.bookingCreateForm.dep_date,
                room_category_id: this.bookingCreateForm.room_category_id,
                email: this.bookingCreateForm.email,
                phone: this.bookingCreateForm.phone,
                city: this.bookingCreateForm.city,
                guests: [
                    {
                        name: guest.name,
                        surname: guest.surname,
                        patronymic: guest.patronymic,
                        birthday: guest.birthday,
                        gender: guest.gender,
                        document_type_id: guest.document_type_id,
                        document_number: guest.document_number,
                    }
                ],
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/booking`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);

                    this.bookingCreateForm = {
                        arr_date: null,
                        dep_date: null,
                        room_category_id: null,
                        email: null,
                        phone: null,
                        city: null,
                        guests: [
                            {
                                name: null,
                                surname: null,
                                patronymic: null,
                                birthday: null,
                                gender: null,
                                document_type_id: null,
                                document_number: null,
                            },
                        ],
                    };

                    this.controlApplicationsFunc();
                    this.controlManagerFunc();
                    this.controlPrice();

                    this.openPage('control');
                })
                .catch((error) => console.error(error));
        },

        // Просмотр всех категорий
        categoryPage() {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            fetch(`${host}/category`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.category = result;
                })
                .catch((error) => console.error(error));
        },

        // Просмотр одной категории
        categoryOfOne(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${host}/category/${id}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.categoryOne = result;
                    this.openPage('сategoriesName');
                })
                .catch((error) => console.error(error));
        },

        // Добавление нового гостя
        addNewGuests() {
            let guest = {
                name: null,
                surname: null,
                patronymic: null,
                birthday: null,
                gender: null,
                document_type_id: null,
                document_number: null,
            };

            this.bookingCreateForm.guests.push(guest);
        },

        // Удаление гостя
        delNewGuests(i) {

        },

        // Сведения о стоимости проживания по датам
        calculationValue() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "arr_date": this.calculationValueForm.arr_date,
                "dep_date": this.calculationValueForm.dep_date,
                "room_category_id": this.calculationValueForm.room_category_id,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/calculation`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);

                    this.calculationPriceForm = {
                        arr_date: null,
                        dep_date: null,
                        room_category_id: null,
                    };

                    this.openPage('addBooking');
                })
                .catch((error) => console.error(error));

        },

        // Создание прайса
        createPrice() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const raw = JSON.stringify({
                "room_category_id": this.createPriceForm.room_category_id,
                "value": this.createPriceForm.value,
                "start_date": this.createPriceForm.start_date,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/price`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);

                    this.createPriceForm = {
                        room_category_id: null,
                        value: null,
                        start_date: null,
                    };

                    this.openPage('control');
                    this.controlPrice();
                })
                .catch((error) => console.error(error));
        },

        // Изменение прайса
        editPrice(elem) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.user_token}`);

            const raw = JSON.stringify({
                "value": elem.value,
            });

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/price/${elem.id}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);

                    this.editPriceForm.value = null;

                    this.controlPrice();
                })
                .catch((error) => console.error(error));
        }
    },
    mounted() {
        this.categoryPage();
        if (this.user_token) {
            this.controlApplicationsFunc();
            this.controlManagerFunc();
            this.controlPrice();
        } else {
            this.openPage('login');
        }
    }
}).mount('#app');