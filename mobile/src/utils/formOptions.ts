import { 
    GenderMale, 
    GenderFemale, 
    Target, 
    Barbell, 
    Fire, 
    PersonSimpleRun,
    Person,
    Bed
} from 'phosphor-react-native';

export const genderOptions = [
    { label: "Masculino", value: "masculino", icon: GenderMale },
    { label: "Feminino", value: "feminino", icon: GenderFemale }
];

export const objectiveOptions = [
    { label: 'Emagrecer', value: 'emagrecer', icon: Fire },
    { label: 'Hipertrofia', value: 'hipertrofia', icon: Barbell },
    { label: 'Definição', value: 'definicao', icon: Target },
];

export const levelOptions = [
    { label: 'Sedentário', value: 'sedentario', description: 'Nenhuma atividade', icon: Bed },
    { label: 'Levemente Ativo', value: 'levemente_ativo', description: '1 a 3x na semana', icon: Person },
    { label: 'Moderadamente Ativo', value: 'moderadamente_ativo', description: '3 a 5x na semana', icon: PersonSimpleRun },
    { label: 'Altamente Ativo', value: 'altamente_ativo', description: '5 a 7x na semana', icon: Barbell },
];