import axios from "axios";
import moment from "moment";

// BigHistoryRepository.ts
class BigHistoryRepository {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() { }

	async root(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/0?expandChildren=true")
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async search(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/search", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async download(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: '/api/download',
			method: 'GET',
			responseType: 'blob',
		}).then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `big-history-${moment().format("YYYYMMDD")}.json`);
			document.body.appendChild(link);
			link.click();
			link.parentNode!.removeChild(link);
			onSuccess && onSuccess(request, response.data, element);
		})
		.catch(error => onError && onError(request, error, element));
	}
	async update(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.put("./api/" + request.id, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new BigHistoryRepository();
