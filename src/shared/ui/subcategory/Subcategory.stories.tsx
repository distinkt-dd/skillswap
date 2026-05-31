import { Subcategory, type TSubcategoryProps } from './Subcategory';
import {
  BriefcaseIcon,
  GlobalIcon,
  IdeaIcon,
  BookIcon,
  HomeIcon,
  LifestyleIcon,
} from '@shared/assets';

export default {
  title: 'Subcategory',
  component: Subcategory,
  args: {
    title: 'Игра на гитаре',
    type: 'business',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['business', 'languages', 'creative', 'education', 'home', 'health', 'other'],
    },
    title: {
      control: 'text',
    },
  },
};

export const Default = {
  args: {
    title: 'Игра на гитаре',
    type: 'creative',
  },
};

export const WithIcon = {
  args: {
    title: '',
    type: 'business',
  },
  render: (args: TSubcategoryProps) => {
    const iconMap = {
      business: <BriefcaseIcon />,
      languages: <GlobalIcon />,
      creative: <IdeaIcon />,
      education: <BookIcon />,
      home: <HomeIcon />,
      health: <LifestyleIcon />,
      other: '⭐',
    };
    const currentIcon = iconMap[args.type as keyof typeof iconMap] || '⭐';

    return <Subcategory type={args.type} title={args.title} icon={currentIcon} />;
  },
};

export const AllIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Subcategory type="business" title="Бизнес" icon={<BriefcaseIcon />} />
      <Subcategory type="languages" title="Иностранные языки" icon={<GlobalIcon />} />
      <Subcategory type="education" title="Образование" icon={<BookIcon />} />
      <Subcategory type="home" title="Дом" icon={<HomeIcon />} />
      <Subcategory type="health" title="Здоровье" icon={<LifestyleIcon />} />
      <Subcategory type="creative" title="Творчество" icon={<IdeaIcon />} />
      <Subcategory type="other" title="Другое" icon="⭐" />
    </div>
  ),
};
