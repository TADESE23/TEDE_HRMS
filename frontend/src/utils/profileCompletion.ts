/**
 * Profile Completion Utility
 * Calculates what percentage of an employee's profile is filled in,
 * broken down by section with per-field granularity.
 */

export interface CompletionField {
    key: string;
    label: string;
    filled: boolean;
    required: boolean;
}

export interface CompletionSection {
    id: string;
    label: string;
    icon: string;
    fields: CompletionField[];
    completed: number;
    total: number;
    percentage: number;
}

export interface ProfileCompletion {
    percentage: number;
    status: 'incomplete' | 'partial' | 'complete';
    sections: CompletionSection[];
    missingRequired: CompletionField[];
    totalFilled: number;
    totalFields: number;
}

function isFilled(val: any): boolean {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (typeof val === 'number') return !isNaN(val);
    return Boolean(val);
}

export function computeProfileCompletion(employee: any): ProfileCompletion {
    const ap = employee?.academic_profile || {};
    const history = employee?.employment_history || [];
    const isAcademic = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'].includes(
        employee?.role || employee?.staff_category || ''
    );

    const personalFields: CompletionField[] = [
        { key: 'first_name',       label: 'First Name',          filled: isFilled(employee?.first_name),       required: true  },
        { key: 'last_name',        label: 'Last Name',           filled: isFilled(employee?.last_name),        required: true  },
        { key: 'email',            label: 'Work Email',          filled: isFilled(employee?.email),            required: true  },
        { key: 'phone',            label: 'Phone Number',        filled: isFilled(employee?.phone),            required: true  },
        { key: 'date_of_birth',    label: 'Date of Birth',       filled: isFilled(employee?.date_of_birth),    required: true  },
        { key: 'gender',           label: 'Gender',              filled: isFilled(employee?.gender),           required: true  },
        { key: 'address',          label: 'Address',             filled: isFilled(employee?.address),          required: false },
        { key: 'tin_number',       label: 'TIN Number',          filled: isFilled(employee?.tin_number),       required: false },
        { key: 'email_personal',   label: 'Personal Email',      filled: isFilled(employee?.email_personal),   required: false },
    ];

    const employmentFields: CompletionField[] = [
        { key: 'employee_id_number', label: 'Employee ID',       filled: isFilled(employee?.employee_id_number), required: true  },
        { key: 'department',         label: 'Department',        filled: isFilled(employee?.department || employee?.department_name), required: true  },
        { key: 'role',               label: 'Role / Title',      filled: isFilled(employee?.role),              required: true  },
        { key: 'status',             label: 'Employment Status', filled: isFilled(employee?.status),            required: true  },
        { key: 'date_of_joining',    label: 'Date of Joining',   filled: isFilled(employee?.date_of_joining),   required: true  },
        { key: 'employment_type',    label: 'Employment Type',   filled: isFilled(employee?.employment_type),   required: false },
        { key: 'history_record',     label: 'Employment History Record', filled: history.length > 0,            required: false },
    ];

    const academicFields: CompletionField[] = isAcademic ? [
        { key: 'rank',               label: 'Academic Rank',       filled: isFilled(ap?.rank || ap?.academic_rank), required: true  },
        { key: 'highest_degree',     label: 'Highest Degree',      filled: isFilled(ap?.highest_degree),            required: true  },
        { key: 'specialization',     label: 'Specialization',      filled: isFilled(ap?.specialization),            required: true  },
        { key: 'total_publications', label: 'Publication Count',   filled: typeof ap?.total_publications === 'number', required: false },
        { key: 'cgpa',               label: 'CGPA',                filled: isFilled(ap?.cgpa),                      required: false },
    ] : [];

    const documentFields: CompletionField[] = [
        { key: 'has_documents', label: 'Supporting Documents', filled: isFilled(employee?.document_count) && Number(employee?.document_count) > 0, required: false },
    ];

    const buildSection = (id: string, label: string, icon: string, fields: CompletionField[]): CompletionSection => {
        const filled = fields.filter(f => f.filled).length;
        const total  = fields.length;
        return {
            id, label, icon, fields,
            completed: filled,
            total,
            percentage: total === 0 ? 100 : Math.round((filled / total) * 100)
        };
    };

    const sections = [
        buildSection('personal',   'Personal Info',     '👤', personalFields),
        buildSection('employment', 'Employment Details','💼', employmentFields),
        ...(isAcademic ? [buildSection('academic', 'Academic Profile', '🎓', academicFields)] : []),
        buildSection('documents',  'Documents',         '📄', documentFields),
    ];

    const totalFilled = sections.reduce((sum, s) => sum + s.completed, 0);
    const totalFields = sections.reduce((sum, s) => sum + s.total, 0);
    const percentage  = totalFields === 0 ? 0 : Math.round((totalFilled / totalFields) * 100);

    const missingRequired = sections
        .flatMap(s => s.fields)
        .filter(f => f.required && !f.filled);

    const status: ProfileCompletion['status'] =
        percentage === 100 ? 'complete' :
        percentage >= 60   ? 'partial'  :
                             'incomplete';

    return { percentage, status, sections, missingRequired, totalFilled, totalFields };
}
