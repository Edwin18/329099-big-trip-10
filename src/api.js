const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Status = {
  SUCCESSFUL: 200,
  REDIRECTS: 300
};

const checkStatus = (response) => {
  if (response.status >= Status.SUCCESSFUL && response.status < Status.REDIRECTS) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
    .then((response) => response.json());
  }

  getOffers() {
    return this._load({url: `offers`})
    .then((response) => response.json());
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then((response) => response.json());
  }

  createPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  updatePoint(id, point) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
