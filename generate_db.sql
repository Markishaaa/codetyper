create table user
(
    username      varchar(50) not null primary key,
    email         varchar(50) not null primary key,
    role          enum('ADMIN', 'USER') not null,
    password_hash tinytext    not null,
    created_at    datetime    not null
);

create table score
(
	id 				int          not null primary key,
	user            varchar(50)  not null,
    snippet_id      int          not null,
    wpm             int          not null,
    accuracy        int          not null,
    
    constraint fk_user_username
        foreign key (user)
            references user (username),

    constraint fk_code_snippet
        foreign key (snippet_id)
            references code_snippet (id)
);

create table code_snippet
(
    id           int         not null primary key auto_increment,
    language     varchar(50) not null,
    title        varchar(50) not null,
    description  mediumtext,
    content      mediumtext  not null
);

insert into code_snippet (content, language, title)
values (
'public <T extends Comparable<T>> void bruteSort(T[] arr) {
  for (int j = 1; j < arr.length; j++) {
    for (int i = 0; i < j; i++) {
      if (arr[i].compareTo(arr[j]) > 0) {
        T tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }
  }
}', 'java', 'Brute Force sort algorithm');

insert into code_snippet (content, language, title)
values (
'public <T extends Comparable<T>> void insertionSort(T[] arr) {
  for (int i = 1; i < arr.length; i++) {
    T curr = arr[i];

    int j = i - 1;
    while (j >= 0 && arr[j].compareTo(curr) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = curr;
  }
}'
, 'java', 'Insertion sort algorithm');

insert into code_snippet (content, language, title)
values (
'public <T extends Comparable<T>> void selectionSort(T[] arr) {
  for (int i = arr.length - 1; i >= 1; i--) {
    int maxIndex = 0;
    for (int j = 1; j <= i; j++) {
      if (arr[maxIndex].compareTo(arr[j]) < 0) {
        maxIndex = j;
      }
    }

    if (maxIndex != i) {
      T tmp = arr[i];
      arr[i] = arr[maxIndex];
      arr[maxIndex] = tmp;s
    }
  }
}'
, 'java', 'Selection sort algorithm');

insert into code_snippet (content, language, title)
values (
'public <T extends Comparable<T>> void exchangeSort(T[] arr) {
  for (int i = arr.length - 1; i >= 1; i--) {
    for (int j = 0; j < i; j++) {
      if (arr[j].compareTo(arr[j + 1]) > 0) {
        T tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
}'
, 'java', 'Exchange sort algorithm');