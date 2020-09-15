import axios from '../overrides/axios';

class InvitationService {
    createInvitation(id, resend = false) {
        return axios.post("/api/invitation", {
            user_id: id,
            resend: resend
        });
    }

    getAll() {
        return axios.get('/api/invitation');
    }

    revoke(id) {
        return axios.put('/api/invitation/' + id + '/revoke');
    }
    delete(id) {
      return axios.delete('/api/invitation/' + id);
    }

    getInvitationByToken(id) {
        return axios.get('/api/invitation/' + id);
    }

    accept(data) {
        return axios.post('/api/invitation/accept', data);
    }
}

const invitationService = new InvitationService();
Object.freeze(invitationService);

export default invitationService;
