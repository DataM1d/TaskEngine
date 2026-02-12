export const detectCategoryFromTitle = (title: string): string => {
    const t = title.toLowerCase().trim();

    //URGENT
    if (
        t.includes('urgent') ||
        t.includes('asap') ||
        t.includes('immediately') ||
        t.includes('now') ||
        t.includes('important') ||
        t.includes('critical') ||
        t.includes('today') ||
        t.includes('overdue') ||
        t.includes('deadline') ||
        t.includes('now')
    ) return 'URGENT';

    //WORK
    if (
        t.includes('work') ||
        t.includes('office') ||
        t.includes('job') ||
        t.includes('task') ||
        t.includes('client') ||
        t.includes('boss') ||
        t.includes('coworker') ||
        t.includes('team') ||
        t.includes('standup') ||
        t.includes('meeting') ||
        t.includes('presentation') ||
        t.includes('report') ||
        t.includes('review')
    ) return 'WORK';

    //PROGRAMMING/tech
    if (
        t.includes('code') ||
        t.includes('coding') ||
        t.includes('programming') ||
        t.includes('bug') ||
        t.includes('fix') ||
        t.includes('deploy') ||
        t.includes('release') ||
        t.includes('build') ||
        t.includes('api') ||
        t.includes('backend') ||
        t.includes('frontend') ||
        t.includes('ui') ||
        t.includes('ux') ||
        t.includes('database') ||
        t.includes('server') ||
        t.includes('dev') ||
        t.includes('debug') ||
        t.includes('refactor') ||
        t.includes('typescript') ||
        t.includes('javascript')
    ) return 'PROGRAMMING';

    //ADMIN/LIFE MAINTANCE
    if (
        t.includes('document') ||
        t.includes('paperwork') ||
        t.includes('form') ||
        t.includes('submit') ||
        t.includes('application') ||
        t.includes('renew') ||
        t.includes('license') ||
        t.includes('passport') ||
        t.includes('id') ||
        t.includes('insurance') ||
        t.includes('appoitment') ||
        t.includes('schedule') 
    ) return 'ADMIN';

    //FINANCE
    if (
        t.includes('pay') ||
        t.includes('payment') ||
        t.includes('bill') ||
        t.includes('invoice') ||
        t.includes('tax') ||
        t.includes('salary') ||
        t.includes('rent') ||
        t.includes('loan') ||
        t.includes('credit') ||
        t.includes('debit') ||
        t.includes('bank') ||
        t.includes('budget') ||
        t.includes('expense') ||
        t.includes('subscription') ||
        t.includes('invest') ||
        t.includes('money')
    ) return 'FINANCE';

    //SHOPPING/ERRANDS
    if (
        t.includes('buy') ||
        t.includes('purchase') ||
        t.includes('order') ||
        t.includes('shop') ||
        t.includes('shopping') ||
        t.includes('grocery') ||
        t.includes('groceries') ||
        t.includes('store') ||
        t.includes('market') ||
        t.includes('mall') ||
        t.includes('amazon') ||
        t.includes('pickup')
    ) return 'SHOPPING';

    //Health
    if (
        t.includes('doctor') ||
        t.includes('dentist') ||
        t.includes('appointment') ||
        t.includes('medicine') ||
        t.includes('medication') ||
        t.includes('pill') ||
        t.includes('hospital') ||
        t.includes('therapy') ||
        t.includes('mental') ||
        t.includes('checkup')
    ) return 'HEALTH';


    //FITNESS
    if (
        t.includes('gym') ||
        t.includes('workout') ||
        t.includes('exercise') ||
        t.includes('run') ||
        t.includes('jog') ||
        t.includes('walk') ||
        t.includes('yoga') ||
        t.includes('stretch') ||
        t.includes('training') ||
        t.includes('cardio') ||
        t.includes('lift')
    ) return 'WORKOUT';
    
    //EDUCATION
    if (
        t.includes('study') ||
        t.includes('learn') ||
        t.includes('course') ||
        t.includes('class') ||
        t.includes('lesson') ||
        t.includes('homework') ||
        t.includes('assignment') ||
        t.includes('exam') ||
        t.includes('test') ||
        t.includes('reading') ||
        t.includes('book') ||
        t.includes('notes')
    ) return 'EDUCATION';

    //COMMUNICATION
    if (
        t.includes('call') ||
        t.includes('phone') ||
        t.includes('email') ||
        t.includes('mail') ||
        t.includes('message') ||
        t.includes('text') ||
        t.includes('reply') ||
        t.includes('respond') ||
        t.includes('follow up') ||
        t.includes('dm')
    ) return 'COMMUNICATION';

    //HOME
    if (
        t.includes('clean') ||
        t.includes('cleaning') ||
        t.includes('laundry') ||
        t.includes('wash') ||
        t.includes('dishes') ||
        t.includes('vacuum') ||
        t.includes('trash') ||
        t.includes('repair') ||
        t.includes('fix') ||
        t.includes('maintenance')
    ) return 'HOME';

    //SOCIAL/RELATIONSHIPS
      if (
        t.includes('friend') ||
        t.includes('family') ||
        t.includes('parents') ||
        t.includes('kids') ||
        t.includes('wife') ||
        t.includes('husband') ||
        t.includes('partner') ||
        t.includes('birthday') ||
        t.includes('party') ||
        t.includes('wedding')
    ) return 'SOCIAL';

    //TRAVEL
    if (
        t.includes('travel') ||
        t.includes('trip') ||
        t.includes('flight') ||
        t.includes('hotel') ||
        t.includes('booking') ||
        t.includes('vacation') ||
        t.includes('pack') ||
        t.includes('airport') ||
        t.includes('drive')
    ) return 'TRAVEL';


    //Perosnal
     if (
        t.includes('journal') ||
        t.includes('reflect') ||
        t.includes('plan') ||
        t.includes('goals') ||
        t.includes('habit') ||
        t.includes('routine') ||
        t.includes('meditate') ||
        t.includes('relax') ||
        t.includes('rest') ||
        t.includes('roll') ||
        t.includes('smoke') ||
        t.includes('chill')
    ) return 'PERSONAL';

    return 'OTHER';
};

