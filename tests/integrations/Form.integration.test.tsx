import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as yup from 'yup';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';

describe('FormWrapper + FormField Integration', () => {
  const user = userEvent.setup();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  const fill = async (label: string, value: string): Promise<void> => {
    const input = screen.getByLabelText(label);
    await user.clear(input);
    await user.type(input, value);
  };

  test('submits form successfully with all supported field types', async () => {
    const schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email().required(),
      bio: yup.string().min(10).required(),
      skill: yup.string().required(),
      birthDate: yup.string().required(),
      subscribe: yup.boolean(),
    });

    render(
      <FormWrapper validationSchema={schema} onSubmit={mockSubmit}>
        <FormField label="Name" id="name" />
        <FormField label="Email" id="email" type="email" />
        <FormField label="Bio" id="bio" type="textarea" />
        <FormField
          label="Skill Level"
          id="skill"
          type="radio"
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
          ]}
        />
        <FormField label="Birth Date" id="birthDate" type="date" />
        <FormField label="Subscribe to newsletter" id="subscribe" type="checkbox" />
      </FormWrapper>,
    );

    await fill('Name', 'Alex');
    await fill('Email', 'alex@example.com');
    await fill('Bio', 'This is my outdoor bio.');

    // Select radio option
    await user.click(screen.getByLabelText('Intermediate'));

    // Fill date input
    await user.type(screen.getByLabelText('Birth Date'), '1990-05-01');

    // Click checkbox
    await user.click(screen.getByLabelText('Subscribe to newsletter'));

    // Form should now be valid
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();

    await user.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          name: 'Alex',
          email: 'alex@example.com',
          bio: 'This is my outdoor bio.',
          skill: 'intermediate',
          birthDate: '1990-05-01',
          subscribe: true,
        },
        expect.anything(),
      );
    });
  });

  test('disables button if validation fails on any field', async () => {
    const schema = yup.object({
      name: yup.string().required(),
      email: yup.string().required(),
    });

    render(
      <FormWrapper validationSchema={schema} onSubmit={mockSubmit}>
        <FormField label="Name" id="name" />
        <FormField label="Email" id="email" />
      </FormWrapper>,
    );

    // Fill one field only
    await fill('Name', 'Missing email');

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    // Fill email too
    await fill('Email', 'complete@example.com');
    expect(button).toBeEnabled();
  });

  test('displays validation messages for all types', async () => {
    const schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email().required('Email required'),
      bio: yup.string().required('Bio required').min(10, 'Too short'),
      skill: yup.string().required('Skill required'),
      birthDate: yup.string().required('Date required'),
    });

    render(
      <FormWrapper validationSchema={schema} onSubmit={mockSubmit}>
        <FormField label="Name" id="name" />
        <FormField label="Email" id="email" />
        <FormField label="Bio" id="bio" type="textarea" />
        <FormField
          label="Skill"
          id="skill"
          type="radio"
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
        />
        <FormField label="Birth Date" id="birthDate" type="date" />
      </FormWrapper>,
    );

    // Trigger blur on all fields
    await user.tab(); // name
    await user.tab(); // email
    await user.tab(); // bio
    await user.tab(); // radio
    await user.tab(); // date
    await user.tab(); // submit

    expect(await screen.findByText('Bio required')).toBeInTheDocument();
  });
});
