import type { Contact, ContactData, ContactService } from './types';

/**
 * Mock Contact Service Implementation
 * Uses localStorage for persistence
 * Can be replaced with HubSpotContactService when ready
 */
class MockContactService implements ContactService {
  private readonly STORAGE_KEY = 'franchise_clarity_contacts';

  private getContacts(): Map<string, Contact> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return new Map();
    
    try {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    } catch {
      return new Map();
    }
  }

  private saveContacts(contacts: Map<string, Contact>): void {
    const data = Object.fromEntries(contacts);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async createOrUpdate(contactData: ContactData): Promise<Contact> {
    const contacts = this.getContacts();
    const existing = contacts.get(contactData.email);
    const now = new Date().toISOString();

    const contact: Contact = {
      id: existing?.id || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: contactData.email,
      firstName: contactData.firstName || existing?.firstName,
      lastName: contactData.lastName || existing?.lastName,
      franchiseInterests: contactData.franchiseInterests || existing?.franchiseInterests || [],
      investmentRange: contactData.investmentRange || existing?.investmentRange,
      unlockedBrands: contactData.unlockedBrands || existing?.unlockedBrands || [],
      signUpDate: existing?.signUpDate || contactData.signUpDate || now,
      lastActivityDate: now,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    contacts.set(contactData.email, contact);
    this.saveContacts(contacts);

    return contact;
  }

  async getByEmail(email: string): Promise<Contact | null> {
    const contacts = this.getContacts();
    return contacts.get(email) || null;
  }

  async getById(id: string): Promise<Contact | null> {
    const contacts = this.getContacts();
    for (const contact of contacts.values()) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  async updateLastActivity(email: string): Promise<void> {
    const contacts = this.getContacts();
    const contact = contacts.get(email);
    
    if (contact) {
      contact.lastActivityDate = new Date().toISOString();
      contact.updatedAt = new Date().toISOString();
      contacts.set(email, contact);
      this.saveContacts(contacts);
    }
  }
}

export default MockContactService;


