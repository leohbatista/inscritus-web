export const data = {
  mode: process.env.GCLOUD_PROJECT === 'mc853-f59e9' ? 'dev' : 'prod',
  keyToken: 'm09cmwe;kmr209cmas;du093JPOakoiOIJOI&*HIUHO*&h98p98hpP98HOJ;LKJP09joij[09J[09jlkjkhjgklkhj;l009asdfasdlf',
  keyCustomToken: process.env.GCLOUD_PROJECT === 'mc853-f59e9' ?
    'PYwRqIPglD3cQA4Zbt63SBHrq8lW72eMPQe7audCyWeFWZexJaqccyJJwwfsnA64' : 'PKGBbrdMTswaoAxPJspDDnTZfXxIe4HuFOwg6OsQ8eqmfe2oMhsQLDqqadz5Y6pd',
  userUid: process.env.GCLOUD_PROJECT === 'mc853-f59e9' ? '8fgkHyHz3QS88tMzJGbZgOy6jth2' : 'HeH0sureQghfFesSLhQ33WcBggz1',
  userAuthEmail: ''
};

export const config = {
  data
};

export const keyEncryptUrl = 'InscritusEncryptKeyInscritus';
