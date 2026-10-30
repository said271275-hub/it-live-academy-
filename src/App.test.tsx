import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App, { STORAGE_KEY } from './App';

describe('IT Live Academy - 5 ta rol va autentifikatsiya testlari', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1-holat: Guest (kirmagan foydalanuvchi)
  it('1. Guest holatida faqat Bosh sahifa, Kurslar va Kirish menyulari ko\'rinadi', () => {
    render(<App />);

    expect(screen.getByTestId('menu-item-home')).toHaveTextContent('Bosh sahifa');
    expect(screen.getByTestId('menu-item-courses')).toHaveTextContent('Kurslar');
    expect(screen.getByTestId('login-nav-button')).toHaveTextContent('Kirish');

    // Talaba, mentor yoki admin maxsus menyulari ko'rinmasligi kerak
    expect(screen.queryByTestId('menu-item-my-courses')).not.toBeInTheDocument();
    expect(screen.queryByTestId('menu-item-my-groups')).not.toBeInTheDocument();
    expect(screen.queryByTestId('menu-item-statistics')).not.toBeInTheDocument();
  });

  // 2-holat: Student
  it('2. Student roli uchun to\'g\'ri menyu chiqadi: Bosh sahifa, Mening kurslarim, Vazifalar, Profil, Chiqish', async () => {
    render(<App />);

    // Kirish tugmasini bosish
    fireEvent.click(screen.getByTestId('login-nav-button'));

    // Student bilan login qilish
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'student' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    // Student menyusini tekshirish
    expect(await screen.findByTestId('menu-item-my-courses')).toHaveTextContent('Mening kurslarim');
    expect(screen.getByTestId('menu-item-assignments')).toHaveTextContent('Vazifalar');
    expect(screen.getByTestId('menu-item-profile')).toHaveTextContent('Profil');
    expect(screen.getByTestId('logout-button')).toHaveTextContent('Chiqish');

    // Boshqa rollar menyulari yo'qligini tekshirish
    expect(screen.queryByTestId('menu-item-my-groups')).not.toBeInTheDocument();
    expect(screen.queryByTestId('menu-item-statistics')).not.toBeInTheDocument();
  });

  // 3-holat: Mentor
  it('3. Mentor roli uchun to\'g\'ri menyu chiqadi: Bosh sahifa, Guruhlarim, Vazifalarni tekshirish, Profil, Chiqish', async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('login-nav-button'));
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'mentor' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    expect(await screen.findByTestId('menu-item-my-groups')).toHaveTextContent('Guruhlarim');
    expect(screen.getByTestId('menu-item-check-tasks')).toHaveTextContent('Vazifalarni tekshirish');
    expect(screen.getByTestId('menu-item-profile')).toHaveTextContent('Profil');
    expect(screen.getByTestId('logout-button')).toHaveTextContent('Chiqish');

    expect(screen.queryByTestId('menu-item-my-courses')).not.toBeInTheDocument();
  });

  // 4-holat: Admin
  it('4. Admin roli uchun to\'g\'ri menyu chiqadi: Bosh sahifa, Foydalanuvchilar, Rollar, Statistika, Chiqish', async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('login-nav-button'));
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    expect(await screen.findByTestId('menu-item-users')).toHaveTextContent('Foydalanuvchilar');
    expect(screen.getByTestId('menu-item-roles')).toHaveTextContent('Rollar');
    expect(screen.getByTestId('menu-item-statistics')).toHaveTextContent('Statistika');
    expect(screen.getByTestId('logout-button')).toHaveTextContent('Chiqish');
  });

  // 5-holat: Blocked
  it('5. Blocked holatida hech qanday navigatsiya menyusi yo\'q, faqat "Akkaunt bloklangan" va Chiqish bor', async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('login-nav-button'));
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'blocked' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    // Menyuning butunlay yo'qligini tekshirish
    expect(screen.queryByTestId('role-menu')).not.toBeInTheDocument();

    // Bloklanganlik xabari va Chiqish tugmasi
    expect(await screen.findByTestId('blocked-heading')).toHaveTextContent('Akkaunt bloklangan');
    expect(screen.getByTestId('blocked-logout-button')).toHaveTextContent('Tizimdan chiqish');
  });

  // Login xatolik holati
  it('6. Noto\'g\'ri parol kiritilganda o\'zbekcha xato xabari ko\'rsatiladi', async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('login-nav-button'));
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'student' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'notogri_parol' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    expect(await screen.findByTestId('login-error-message')).toHaveTextContent(
      'Login yoki parol noto\'g\'ri! Iltimos, qaytadan urinib ko\'ring.'
    );
  });

  // Logout oqimi
  it('7. Chiqish (logout) tugmasi bosilganda Guest holatiga qaytadi va localStorage tozalanadi', async () => {
    render(<App />);

    // Admin sifatida kirish
    fireEvent.click(screen.getByTestId('login-nav-button'));
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    expect(await screen.findByTestId('menu-item-statistics')).toBeInTheDocument();

    // Chiqish tugmasini bosish
    fireEvent.click(screen.getByTestId('logout-button'));

    // Qaytib Guest holatiga kelganligini tekshirish
    expect(screen.getByTestId('login-nav-button')).toHaveTextContent('Kirish');
    expect(screen.queryByTestId('menu-item-statistics')).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  // F5 (sahifa yangilanganda saqlanish)
  it('8. Sahifa yangilanganda (F5) localStorage orqali foydalanuvchi holati saqlanib qoladi', () => {
    // Oldindan localStorage ga mentor saqlangan deb tasavvur qilamiz (F5 simulyatsiyasi)
    const savedUser = {
      id: 'user-mentor',
      username: 'mentor',
      displayName: 'Sardor Ustoz',
      role: 'mentor',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedUser));

    // Sahifa yangitdan yuklandi
    render(<App />);

    // Mentor ma'lumotlari darhol chiqishi kerak
    expect(screen.getByTestId('user-display-name')).toHaveTextContent('Sardor Ustoz');
    expect(screen.getByTestId('menu-item-my-groups')).toHaveTextContent('Guruhlarim');
    expect(screen.getByTestId('menu-item-check-tasks')).toHaveTextContent('Vazifalarni tekshirish');
  });
});
