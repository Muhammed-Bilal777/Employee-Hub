import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmployeesPage } from '../pages/EmployeesPage';
import { employeeService } from '../services/employeeService';
import { vi } from 'vitest';

// Mock the employee service
vi.mock('../services/employeeService');

const mockedService = vi.mocked(employeeService, true);

const mockEmployees = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@test.com',
        department: 'Engineering',
        role: 'Developer',
        salary: 100000,
        joinDate: '2022-01-01',
        lastReview: '2024-01-01',
        isActive: true,
        projects: 2,
        performanceRating: 4,
        skills: ['React'],
        address: { city: 'NY', state: 'NY', country: "US" },
        paymentMethod: 'Bank Transfer',
        isRefunded: false,
    },
];

describe('EmployeesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading initially', async () => {
        mockedService.fetchAll.mockResolvedValue(mockEmployees);

        render(<EmployeesPage />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render employee data after fetch', async () => {
        mockedService.fetchAll.mockResolvedValue(mockEmployees);

        render(<EmployeesPage />);

        await waitFor(() => {
            expect(screen.getByText(/employee directory/i)).toBeInTheDocument();
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Engineering')).toBeInTheDocument();
    });

    it('should show error if fetch fails', async () => {
        mockedService.fetchAll.mockRejectedValue(new Error('API Error'));

        render(<EmployeesPage />);

        await waitFor(() => {
            expect(
                screen.getByText(/failed to load employee data/i)
            ).toBeInTheDocument();
        });
    });

    it('should show record count after load', async () => {
        mockedService.fetchAll.mockResolvedValue(mockEmployees);

        render(<EmployeesPage />);

        await waitFor(() => {
            expect(screen.getByText(/showing/i)).toBeInTheDocument();
        });
    });

    it('should render export button', async () => {
        mockedService.fetchAll.mockResolvedValue(mockEmployees);

        render(<EmployeesPage />);

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: /export/i })
            ).toBeInTheDocument();
        });
    });

    it('should allow filters panel interactions', async () => {
        mockedService.fetchAll.mockResolvedValue(mockEmployees);

        render(<EmployeesPage />);

        await waitFor(() => {
            expect(screen.getByText(/add filter/i)).toBeInTheDocument();
        });

        const addFilterButton = screen.getByRole('button', { name: /add filter/i });
        expect(addFilterButton).toBeEnabled();
    });
});