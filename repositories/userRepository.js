import authService from '../services/authService.js';
import firestoreService from '../services/firestoreService.js';
import { User } from '../models/User.js';

export class UserRepository {
    /**
     * @param {Object} auth
     * @param {Object} firestore
     */
    constructor(auth = authService, firestore = firestoreService) {
        this.authService = auth;
        this.firestoreService = firestore;
    }

    /**
     * @param {User|Object} userData
     * @returns {Promise<User>}
     */
    async createAccount(userData) {
        try {
            if (!userData.email || !userData.password) {
                throw new Error("E-mail e senha são obrigatórios para criação de conta.");
            }

            // 1. Cria a conta no Firebase Authentication
            const authUser = await this.authService.signUp(userData.email, userData.password);

            // 2. Atualiza displayName e photoURL na conta de autenticação se informados
            if (userData.displayName || userData.photoURL) {
                try {
                    await this.authService.updateUserProfile(
                        userData.displayName || '',
                        userData.photoURL || ''
                    );
                } catch (profileError) {
                    console.warn(`[UserRepository] Aviso ao atualizar perfil Auth: ${profileError.message}`);
                }
            }

            // 3. Monta o modelo User com o mesmo UID gerado pela conta Auth
            const userEntity = new User({
                ...userData,
                uid: authUser.uid,
                emailVerified: authUser.emailVerified || false,
                password: null // Senha não deve ser armazenada no Firestore
            });

            // 4. Salva os dados do usuário na coleção do Firestore
            const savedUser = await this.firestoreService.createUser(userEntity);
            return savedUser;
        } catch (error) {
            this._handleError('createAccount', error);
            throw error;
        }
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    async authenticate(email, password) {
        try {
            const authUser = await this.authService.signIn(email, password);

            let user = await this.firestoreService.getUserById(authUser.uid);

            if (!user) {
                user = new User({
                    uid: authUser.uid,
                    email: authUser.email,
                    displayName: authUser.displayName || '',
                    photoURL: authUser.photoURL || '',
                    emailVerified: authUser.emailVerified || false
                });
            }

            return user;
        } catch (error) {
            this._handleError('authenticate', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<User|null>}
     */
    async getCurrentUser() {
        try {
            const currentAuthUser = this.authService.getCurrentUser ? this.authService.getCurrentUser() : null;
            if (!currentAuthUser) {
                return null;
            }
            return await this.getById(currentAuthUser.uid);
        } catch (error) {
            this._handleError('getCurrentUser', error);
            throw error;
        }
    }

    /**
     * @param {string} uid
     * @returns {Promise<User|null>}
     */
    async getById(uid) {
        try {
            return await this.firestoreService.getUserById(uid);
        } catch (error) {
            this._handleError('getById', error);
            throw error;
        }
    }

    /**
     * @param {string} email
     * @returns {Promise<User|null>}
     */
    async getByEmail(email) {
        try {
            return await this.firestoreService.getUserByEmail(email);
        } catch (error) {
            this._handleError('getByEmail', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getAll() {
        try {
            return await this.firestoreService.getAllUsers();
        } catch (error) {
            this._handleError('getAll', error);
            throw error;
        }
    }

    /**
     * @param {string} uid
     * @param {Object} updateData
     * @returns {Promise<User>}
     */
    async update(uid, updateData) {
        try {
            const updatedUser = await this.firestoreService.updateUser(uid, updateData);

            if (updateData.displayName !== undefined || updateData.photoURL !== undefined) {
                try {
                    await this.authService.updateUserProfile(
                        updateData.displayName || '',
                        updateData.photoURL || ''
                    );
                } catch {
                }
            }

            return updatedUser;
        } catch (error) {
            this._handleError('update', error);
            throw error;
        }
    }

    /**
     * @param {string} uid
     * @returns {Promise<User>}
     */
    async disable(uid) {
        try {
            return await this.firestoreService.updateUser(uid, { disable: true });
        } catch (error) {
            this._handleError('disable', error);
            throw error;
        }
    }

    /**
     * @param {string} uid
     * @returns {Promise<boolean>}
     */
    async delete(uid) {
        try {
            return await this.firestoreService.deleteUser(uid);
        } catch (error) {
            this._handleError('delete', error);
            throw error;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async signOut() {
        try {
            await this.authService.signOutUser();
        } catch (error) {
            this._handleError('signOut', error);
            throw error;
        }
    }

    /**
     * @param {string} action
     * @param {Error} error
     * @private
     */
    _handleError(action, error) {
        console.error(`[UserRepository - ${action}] Code: ${error.code || 'UNKNOWN'}, Message: ${error.message}`);
    }
}

export default new UserRepository();