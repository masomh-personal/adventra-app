import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '@/pages/contact';
import { useRouter } from 'next/router';

// Note: fireEvent.change is used only for direct value setting (2000+ chars), which is faster than userEvent.type

vi.mock('next/router', () => ({
    useRouter: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);

// Silence test logs
vi.spyOn(console, 'log').mockImplementation(() => {});

interface ContactFormData {
    name?: string;
    email?: string;
    message?: string;
}

describe('ContactPage', () => {
    const mockPush = vi.fn();

    const fillContactForm = async (
        user: ReturnType<typeof userEvent.setup>,
        {
            name = 'John Doe',
            email = 'john@example.com',
            message = 'Hello Adventra!',
        }: ContactFormData = {},
    ): Promise<void> => {
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const messageInput = screen.getByLabelText(/message/i);

        await user.clear(nameInput);
        await user.type(nameInput, name);
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.clear(messageInput);
        await user.type(messageInput, message);
    };

    const submitForm = async (
        user: ReturnType<typeof userEvent.setup>,
        formData?: ContactFormData,
    ): Promise<void> => {
        await fillContactForm(user, formData);
        await user.click(screen.getByRole('button', { name: /send message/i }));
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<
            typeof useRouter
        >);

        // Global mock for fetch (instant response)
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Mock success' }),
            }),
        ) as typeof fetch;
    });

    afterEach(() => {
        cleanup();
    });

    describe('Initial Rendering', () => {
        test('renders heading, text, and form fields', async () => {
            await act(async () => {
                render(<ContactPage />);
            });

            expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
            expect(screen.getByText(/got questions, feedback/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        });

        test('applies Tailwind spacing classes', async () => {
            await act(async () => {
                render(<ContactPage />);
            });
            expect(screen.getByRole('form')).toHaveClass('space-y-4', 'mt-4');
        });
    });

    describe('Form Interactions', () => {
        test('updates field values on user input', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await fillContactForm(user, { name: 'Jane', email: 'jane@site.com', message: 'Test' });

            const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
            const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
            const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

            expect(nameInput.value).toBe('Jane');
            expect(emailInput.value).toBe('jane@site.com');
            expect(messageInput.value).toBe('Test');
        });

        test('updates character counter as user types', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });

            const input = screen.getByLabelText(/message/i);
            const counter = screen.getByTestId('char-counter');

            // Type a short message
            await user.type(input, 'Hello');
            expect(counter).toHaveTextContent('5/2000');
            expect(counter).toHaveClass('text-green-600');

            // Character counter updates are tested thoroughly in CharacterCounter.test.tsx
            // This integration test just verifies the counter is connected to the input
        });

        test('truncates message input at 2000 characters', async () => {
            await act(async () => {
                render(<ContactPage />);
            });
            const input = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

            // Use fireEvent.change to directly set a long value (much faster than typing)
            const longString = 'A'.repeat(2001);
            fireEvent.change(input, { target: { value: longString } });

            // Truncation should limit to 2000 chars
            expect(input.value.length).toBe(2000);
            expect(input.value).toBe('A'.repeat(2000));
        });
    });

    describe('Validation', () => {
        test('shows required field errors', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });

            const nameInput = screen.getByLabelText(/name/i);
            const emailInput = screen.getByLabelText(/email/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.click(nameInput);
            await user.tab(); // Blur name field
            await user.click(emailInput);
            await user.tab(); // Blur email field
            await user.click(messageInput);
            await user.tab(); // Blur message field

            // After touching fields, validation errors should appear (mode: 'onTouched')
            expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
            expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
            expect(await screen.findByText(/please enter your message/i)).toBeInTheDocument();
        });

        test('triggers native email validation', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
            await user.type(emailInput, 'bad-email');

            await user.click(screen.getByRole('button', { name: /send message/i }));
            expect(emailInput.validity.valid).toBe(false);
        });

        test('shows custom invalid email error', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });

            const form = screen.getByRole('form');
            form.setAttribute('novalidate', 'true');

            await fillContactForm(user, { name: 'Jane', email: 'bad', message: 'Hello there!' });

            await user.click(screen.getByRole('button', { name: /send message/i }));

            expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
        });

        test('shows message length error if too short', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });

            const form = screen.getByRole('form');
            form.setAttribute('novalidate', 'true');

            await fillContactForm(user, { name: 'John', email: 'john@example.com', message: 'Hi' });

            await user.click(screen.getByRole('button', { name: /send message/i }));

            expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        test('displays success UI after submit', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await submitForm(user);
            expect(screen.getByTestId('success-message')).toBeInTheDocument();
        });

        test('removes form after submit', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await submitForm(user);
            expect(screen.queryByRole('form')).not.toBeInTheDocument();
        });
    });

    describe('Post-Submission UI', () => {
        beforeEach(async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await submitForm(user);
        });

        test('shows alert with thank you message', () => {
            expect(screen.getByRole('alert')).toHaveTextContent(/thanks for reaching out/i);
        });

        test('displays navigation buttons', () => {
            expect(screen.getByTestId('return-home-btn')).toBeInTheDocument();
            expect(screen.getByTestId('go-to-login-btn')).toBeInTheDocument();
        });

        test('buttons have correct visual classes', () => {
            const home = screen.getByTestId('return-home-btn');
            const login = screen.getByTestId('go-to-login-btn');

            expect(home).toHaveClass('bg-primary', 'text-white');
            expect(login).toHaveClass('border-2', 'text-primary', 'bg-transparent');
        });

        test('navigates to / on click', async () => {
            const user = userEvent.setup();
            await user.click(screen.getByTestId('return-home-btn'));
            expect(mockPush).toHaveBeenCalledWith('/');
        });

        test('navigates to /login on click', async () => {
            const user = userEvent.setup();
            await user.click(screen.getByTestId('go-to-login-btn'));
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    describe('Accessibility', () => {
        test('renders accessible email mailto link', async () => {
            await act(async () => {
                render(<ContactPage />);
            });
            const link = screen.getByRole('link', { name: /support@adventra.com/i });
            expect(link).toHaveAttribute('href', 'mailto:support@adventra.com');
        });

        test('ensures all fields are labeled', async () => {
            await act(async () => {
                render(<ContactPage />);
            });
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        });

        test('renders the alert with appropriate role', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await submitForm(user);
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('accepts special characters in input', async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<ContactPage />);
            });
            await submitForm(user, {
                name: "Jöhn O'Dóe-Smith (QA)",
                email: 'john.doe+test@example.com',
                message: '¡Hola! 你好 ありがとう éñçã ✓✓✓',
            });
            expect(screen.getByTestId('success-message')).toBeInTheDocument();
        });
    });

    describe('Performance (Realistic API Delay)', () => {
        test('waits 1500ms before showing success message', async () => {
            const user = userEvent.setup({ delay: null });
            vi.useFakeTimers();

            const fetchMock = vi.fn(
                () =>
                    new Promise<Response>(resolve => {
                        setTimeout(() => {
                            resolve({
                                ok: true,
                                json: () =>
                                    Promise.resolve({ message: 'Simulated delayed success' }),
                            } as Response);
                        }, 1500);
                    }),
            );

            global.fetch = fetchMock;

            await act(async () => {
                render(<ContactPage />);
            });

            await fillContactForm(user, {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message',
            });

            await user.click(screen.getByRole('button', { name: /send message/i }));

            // At this point, fetch has been called, but setTimeout hasn't completed
            expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();

            // Fast-forward time by 1500ms
            await act(async () => {
                vi.advanceTimersByTime(1500);
            });

            // Wait for fetch resolution + DOM update
            await screen.findByTestId('success-message');

            expect(screen.getByTestId('success-message')).toBeInTheDocument();

            vi.useRealTimers();
        });
    });
});
