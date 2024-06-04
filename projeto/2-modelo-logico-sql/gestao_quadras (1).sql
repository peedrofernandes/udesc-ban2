create type tipo_usuario as enum ('comum', 'administrador', 'bolsista');
create table usuario (
  cpf_usuario char(11),
  hashSenha varchar(64),
  email varchar(64),
  tipo tipo_usuario default 'comum',
  data_final_bolsa date,
  
  constraint usuario_pkey primary key (cpf_usuario)
);

create table tipoesporte (
  id_tipo_esporte integer,
  nome varchar(32),
  
  constraint tipoesporte_pkey primary key (id_tipo_esporte)
);

CREATE TABLE bloco(
	id_bloco integer PRIMARY KEY NOT NULL,
	nome character varying(50)
);

CREATE TABLE quadra(
	id_quadra integer PRIMARY KEY NOT NULL,
	id_bloco integer NOT NULL,
  
	CONSTRAINT quadra_id_bloco_fkey FOREIGN KEY (id_bloco)
		REFERENCES bloco (id_bloco) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE
);

create table quadra_tipoesporte (
  id_tipo_esporte integer,
  id_quadra integer,

  constraint quadra_tipoesporte_id_tipo_esporte_fkey foreign key (id_tipo_esporte) 
      references tipoesporte (id_tipo_esporte) match simple
      on update cascade on delete cascade,
  constraint quadra_tipoesporte_id_quadra_fkey foreign key (id_quadra)
      references quadra (id_quadra) match simple
      on update cascade on delete cascade,
  constraint quadra_tipoesporte_pkey primary key (id_tipo_esporte, id_quadra)
);

create type status_agendamento as enum ('reservado', 'cancelado', 'finalizado');
CREATE TABLE agendamento
(
	id_quadra integer NOT NULL,
	status status_agendamento default 'reservado',
	cpf_usuario char(11),
	data timestamp without time zone,
	horario_inicial time without time zone,
	horario_final time without time zone,
	CONSTRAINT agendamento_pkey PRIMARY KEY (id_quadra, cpf_usuario, data),
	CONSTRAINT agendamento_cpf_usuario_fkey FOREIGN KEY (cpf_usuario)
		REFERENCES usuario (cpf_usuario) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT agendamento_id_quadra_fkey FOREIGN KEY (id_quadra)
		REFERENCES quadra (id_quadra) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE

);




