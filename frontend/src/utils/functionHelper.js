import { h, resolveComponent } from 'vue';

export const functionHelper = () => {
  const getRouteParentName = (route) => {
    if (!route.name) return null;

    const splitRoute = route.name.split('-');
    if (splitRoute.length <= 1) return null;

    const parentName = splitRoute.slice(0, -1).join('-');
    return { name: parentName };
  };

  const getFormattedDate = (date) => {
    if (!date) return '-';
    const year = new Date(date).getFullYear();
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
    const day = String(new Date(date).getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const isActiveData = (value, labels = {}) => {
    const Icon = resolveComponent('Icon');
    const { trueLabel = 'Aktif', falseLabel = 'Tidak Aktif' } = labels;

    if (value === true || value === 1) {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-green-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:check-circle' }), trueLabel]
      );
    } else if (value === false || value === 2) {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-red-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:cancel' }), falseLabel]
      );
    } else {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-amber-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:help' }), 'Tidak Diketahui']
      );
    }
  };

  const camelCase = (str) => {
    if (!str) return;
    const words = str.split(' ');
    const capitalizeWords = words
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

    return capitalizeWords.charAt(0).toLowerCase() + capitalizeWords.slice(1);
  };

  const snakeCase = (str) => {
    const words = str.split(' ');
    return String(str)
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  };

  return {
    getRouteParentName,
    getFormattedDate,
    isActiveData,
    camelCase,
    snakeCase,
  };
};
