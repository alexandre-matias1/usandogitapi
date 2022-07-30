export class GitHubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  async add(username) {
    try {
      const user = await GitHubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      this.entries = [user, ...this.entries];
      this.update()
      this.save()
    } catch (error) {
      alert(error.message);
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    //  this.entries = [
    //   {
    //     login: "buzzitos",
    //     name: "Alexandre Matias",
    //     public_repos: "13",
    //     followers: "12",
    //   },
    //   {
    //     login: "maykbrito",
    //     name: "Mayk Brito",
    //     public_repos: "23",
    //     followers: "1200",
    //   },
    //   {
    //     login: "diego3g",
    //     name: "Diego Fernandes",
    //     public_repos: "23",
    //     followers: "1200",
    //   },
    // ];
  }

  save(){
    localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositores").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Deseja deletar a linha?");
        if (isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    
    <td class="user" >
        <img src="https://github.com/buzzitos.png" alt="Foto de perfil git">
        <a href="https://github.com/buzzitos" target="_blank">
            <p>Alexandre Matias</p>
            <span>buzzitos</span>
        </a>
    </td>
    <td class="repositores">
        76
    </td>
    <td class="followers">
        20
    </td>
    <td>
        <button class="remove">&times;</button>
    </td>
   
    `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
