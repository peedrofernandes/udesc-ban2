import styled from "styled-components"
import { Grid } from "../components/Grid"
import { GridItem } from "../components/GridItem"
import { Divider, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BlocoService, { BlocoDTO } from "../services/BlocoService"
import AgendamentoService, { AgendamentoDTO, PostAgendamentoDTO } from "../services/AgendamentoService"
import QuadraService, { QuadraDTO } from "../services/QuadraService"
import AppCard, { AppCardVariant } from "../components/AppCard"
import ModalCriarBloco from "../components/ModalCriarBloco"
import EsporteService, { EsporteDTO } from "../services/EsporteService"
import ModalCriarQuadra from "../components/ModalCriarQuadra"
import ModalCriarAgendamento from "../components/ModalCriarAgendamento"
import FormatDate from "../utils/FormatDate"
import { useAuth, useModal, useToast } from "../contexts/hooks"
import { Modals } from "../contexts/modal"
import GerenciarEsportes from "../components/GerenciarEsportes"
import ModalExclusaoAgendamento from "../components/ModalExclusaoAgendamento"
import ModalExclusaoEsporte from "../components/ModalExclusaoEsporte"
import ModalCriarEsporte from "../components/ModalCriarEsporte"
import ModalCriarBolsista from "../components/ModalCriarBolsista"
import UsuarioService from "../services/UsuarioService"
import { ZodError } from "zod"

const MainContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const CardsContainer = styled.div`
  display: flex;
  margin-top: 80px;
  margin-bottom: 160px;
`

const ScrollableStack = styled(Stack)`
  max-height: 600px; /* Ajuste a altura máxima conforme necessário */
  overflow-y: auto; /* Isso adiciona rolagem vertical se o conteúdo exceder a altura máxima */
  padding: 8px; /* Adicione algum espaço interno, se desejar */
  margin: 8px 0; /* Espaçamento externo para separar dos outros elementos, se necessário */
`;

export default function Main() {
  // Por enquanto - Tela do usuário administrador

  const { setToast } = useToast()
  const { auth } = useAuth()
  const { modal, setModal } = useModal()

  const [blocoOptions, setBlocoOptions] = useState<BlocoDTO[]>([])
  const [quadraOptions, setQuadraOptions] = useState<QuadraDTO[]>([])
  const [agendamentoOptions, setAgendamentoOptions] = useState<AgendamentoDTO[]>([])
  const [blocos, setBlocos] = useState<BlocoDTO[]>([])
  const [quadras, setQuadras] = useState<QuadraDTO[]>([])
  const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([])
  const [esportes, setEsportes] = useState<EsporteDTO[]>([])

  const [, setLoadingData] = useState<boolean>(false)

  const [selectedBloco, setSelectedBloco] = useState<number | undefined>()
  const [selectedQuadra, setSelectedQuadra] = useState<number | undefined>()

  function toggleSelectBloco(id: number) {
    if (selectedBloco === id) {
      setSelectedBloco(undefined)
      setQuadras(quadraOptions)
      setAgendamentos(agendamentoOptions)
    } else {
      setSelectedBloco(id)

      const filteredQuadras = quadraOptions.filter((q) => q.idBloco === id)
      setQuadras(filteredQuadras)

      const filteredAgendamentos = agendamentoOptions.filter((a) => filteredQuadras.some((q) => q.id === a.idQuadra))
      setAgendamentos(filteredAgendamentos)
    }
  }

  function toggleSelectQuadra(id: number) {
    if (selectedQuadra === id) {
      setSelectedQuadra(undefined)

      if (selectedBloco) {
        const filteredAgendamentos = agendamentoOptions.filter((a) => {
          const quadrasDoBloco = quadraOptions.filter((q) => q.idBloco === selectedBloco)
          if (quadrasDoBloco.length === 0) return false
          return quadrasDoBloco.some((q) => q.id === a.idQuadra)
        })

        setAgendamentos(filteredAgendamentos)
      }

    } else {
      setSelectedQuadra(id)
      const selectedQuadra = quadraOptions.find((q) => q.id === id)
      if (!selectedQuadra) return false

      if (selectedQuadra && selectedBloco !== selectedQuadra.idBloco) {
        toggleSelectBloco(selectedQuadra.idBloco)
      }

      const filteredAgendamentos = agendamentoOptions.filter((a) => a.idQuadra === selectedQuadra.id)
      setAgendamentos(filteredAgendamentos)
    }
  }

  useEffect(() => {
    async function loadData() {
      const [blocos, quadras, agendamentos, esportes] = await Promise.all([
        BlocoService.GetBlocos(),
        QuadraService.GetQuadras(),
        AgendamentoService.GetAgendamentos(),
        EsporteService.GetEsportes(),
      ])
      
      setBlocoOptions(blocos)
      setBlocos(blocos)

      setQuadraOptions(quadras)
      setQuadras(quadras)

      const filteredAgendamentos = ((auth && auth.tipoUsuario === 0)
        ? agendamentos.filter((a) => a.cpfUsuario === auth.cpf) 
        : agendamentos)
      .sort((a1, a2) => new Date(a1.dataInicio).getTime() - new Date(a2.dataInicio).getTime())

      setAgendamentoOptions(filteredAgendamentos)
      setAgendamentos(filteredAgendamentos)

      setEsportes(esportes)
    }

    setLoadingData(true)
    loadData().then(() => setLoadingData(false))
  }, [auth])

  // Filtro de agendamentos conforme tipo de usuário
  useEffect(() => {
    
  }, [agendamentoOptions])

  function handleModalCriarEsporte() {
    setModal(Modals.CriarEsporte)
  }
  async function handleCriarEsporte(nome: string) {
    try {
      const esporte = await EsporteService.PostEsporte(nome)
      setEsportes(esportes => [...esportes, esporte])
      setToast({
        msg: `Esporte ${esporte.nome} criado com sucesso!`,
        severity: "success",
      })
      setModal(Modals.None)
    } catch (error) {
      setToast({
        msg: "Houve um erro ao criar um esporte!",
        severity: "error",
      })
    }
  }

  const [selectedEsporte, setSelectedEsporte] = useState<number | null>(null)
  function handleModalExcluirEsporte(id: number) {
    setSelectedEsporte(id)
    setModal(Modals.ExclusaoEsporte)
  }
  async function handleExcluirEsporte() {
    try {
      if (!selectedEsporte) {
        setToast({
          msg: "É preciso selecionar um esporte para excluí-lo!",
          severity: "error",
        })
        return
      }

      await EsporteService.DeleteEsporte(selectedEsporte)
      setEsportes(esportes => esportes.filter((e) => e.id !== selectedEsporte))
      setToast({
        msg: "Esporte excluído com sucesso!",
        severity: "success",
      })
      setModal(Modals.None)
    } catch (error) {
      setToast({
        msg: "Houve um erro ao excluir o esporte!",
        severity: "error",
      })
    }
  }


  async function handleCriarBloco(nome: string) {
    try {
      const bloco = await BlocoService.PostBloco(nome)
      setToast({
        msg: `Bloco ${nome} criado com sucesso!`,
        severity: "success",
      })
      setBlocos(blocos => [...blocos, bloco])
      setModal(Modals.None)
    } catch (error) {
      setToast({
        msg: "Erro ao tentar criar um bloco!",
        severity: "error"
      })
    }
  }

  async function handleCriarQuadra(nomeQuadra: string, idBloco: number, idTiposEsporte: number[]) {
    try {
      const quadra = await QuadraService.PostQuadra({
        nome: nomeQuadra,
        idBloco,
        idTiposEsporte
      })
      setQuadras(quadras => [...quadras, quadra])
      setToast({
        msg: `Quadra ${quadra.nome} criada com sucesso!`,
        severity: "success",
      })
      setModal(Modals.None)
    } catch (error) {
      setToast({
        msg: "Erro ao tentar criar uma nova quadra!",
        severity: "error",
      })
    }
  }

  async function handleCriarAgendamento(dto: PostAgendamentoDTO) {
    try {
      const agendamento = await AgendamentoService.PostAgendamento(dto)
      console.log("CRIAR AGENDAMENTO!!!")
      console.log(agendamento)
      setAgendamentoOptions(agendamentoOptions => [...agendamentoOptions, agendamento])
      setAgendamentos(agendamentos => [...agendamentos, agendamento])

      const quadraAg = quadraOptions.find((q) => q.id === dto.idQuadra)

      setToast({
        msg: `Agendamento na quadra ${(quadraAg as QuadraDTO).nome}, na data ${FormatDate(dto.dataInicio)} realizado!`,
        severity: "success",
      })

      setModal(Modals.None)
    } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
        return setToast({
          msg: error.errors.map((e) => e.message).join("!\n"),
          severity: "error",
        })
      }

      if (error?.response?.data?.Message) {
        return setToast({
          msg: error.response.data.message,
          severity: "error",
        })
      }

      // const triggerErrorMessage = ((error as any).response.data.Message)

      // const errorMessage = triggerErrorMessage 
      //   ? triggerErrorMessage.split(":").slice(2).join(":")
      //   : "Ocorreu um erro ao criar o novo agendamento!"

      setToast({
        msg: "Ocorreu um erro desconhecido ao tentar criar o agendamento.",
        severity: "error",
      })
    }
  }

  const [selectedAgendamento, setSelectedAgendamento] = useState<number | null>(null)
  function handleModalDeleteAgendamento(id: number) {
    setSelectedAgendamento(id)
    setModal(Modals.ExclusaoAgendamento)
  }
  async function handleExcluirAgendamento() {
    try {
      if (!selectedAgendamento) {
        setToast({
          msg: "É preciso selecionar um agendamento antes de excluí-lo!",
          severity: "error",
        })
        return
      }

      await AgendamentoService.DeleteAgendamento(selectedAgendamento)

      const filteredAgendamentoOptions = agendamentoOptions.filter((a) => a.id !== selectedAgendamento)
      const filteredAgendamentos = agendamentos.filter((a) => a.id !== selectedAgendamento)

      setAgendamentoOptions(filteredAgendamentoOptions)
      setAgendamentos(filteredAgendamentos)

      setModal(Modals.None)

      setToast({
        msg: "Agendamento excluído com sucesso!",
        severity: "success",
      })

    } catch (error) {
      setToast({
        msg: "Erro ao excluir um agendamento!",
        severity: "error",
      })
    }
  }

  async function handleCriarBolsista(cpf: string, dataFimBolsa: string) {
    try {
      const usuario = await UsuarioService.PromoverUsuarioABolsista(cpf, dataFimBolsa)
      setToast({
        msg: `Usuário ${usuario.nome} promovido a bolsista com sucesso!`,
        severity: "success"
      })
      setModal(Modals.None)
    } catch (error) {
      setToast({
        msg: "Houve um erro ao tentar promover o usuário a bolsista - Verifique se o CPF foi inserido corretamente!",
        severity: "error",
      })
    }
  }

  return (
    <MainContainer>

    <Divider sx={{ margin: "16px 0" }} />

    {auth && auth.tipoUsuario === 1 && (
      <>
      <GerenciarEsportes 
        esportes={esportes}
        quadras={quadras}
        handleModalCriarEsporte={handleModalCriarEsporte}
        handleCriarEsporte={handleCriarEsporte}
        handleModalExcluirEsporte={handleModalExcluirEsporte}
        handleExcluirEsporte={handleExcluirEsporte}
        />
        <Divider sx={{ margin: "16px 0" }} />
      </>
    )}


    <CardsContainer>
      <Grid>
        {/* Blocos */}
        <GridItem span={4}>
          <ScrollableStack spacing={1}>
            <h3>Blocos</h3>
            {blocos.map((bloco) => (
              <AppCard 
                key={bloco.id} 
                variant={AppCardVariant.bloco} 
                bloco={bloco} 
                onClick={() => toggleSelectBloco(bloco.id)} 
                isSelected={selectedBloco === bloco.id} 
              />
            ))}

            {auth && auth.tipoUsuario === 1 && (
              <AppCard variant={AppCardVariant.add} onClick={() => setModal(Modals.CriarBloco)} />
            )}

          </ScrollableStack>
        </GridItem>

        {/* Quadras */}
        <GridItem span={4}>
        <ScrollableStack spacing={1}>
          <h3>Quadras</h3>
          {quadras.map((quadra) => (
            <AppCard 
              key={quadra.id} 
              variant={AppCardVariant.quadra} 
              quadra={quadra} 
              blocos={blocos}
              esportes={esportes}
              onClick={() => toggleSelectQuadra(quadra.id)} 
              isSelected={selectedQuadra === quadra.id} 
            />
          ))}

          {auth && auth.tipoUsuario === 1 && (
            <AppCard variant={AppCardVariant.add} onClick={() => setModal(Modals.CriarQuadra)} />
          )}

        </ScrollableStack>
        </GridItem>

        {/* Agendamentos */}
        <GridItem span={4}>
        <ScrollableStack spacing={1}>
          {auth && (
            <h3>
              {auth.tipoUsuario === 0 ? "Seus agendamentos" : "Todos os agendamentos"}
            </h3>
          )}
          {agendamentos.map((agendamento) => (
            <AppCard 
              key={agendamento.id} 
              variant={AppCardVariant.agendamento}
              agendamento={agendamento} 
              quadras={quadras}
              handleModalDeleteAgendamento={handleModalDeleteAgendamento}
            />
          ))}

          <AppCard variant={AppCardVariant.add} onClick={() => setModal(Modals.CriarAgendamento)} />

        </ScrollableStack>
        </GridItem>

      </Grid>
    </CardsContainer>

    <Divider />

  {modal !== Modals.None && (
    <>
      <ModalCriarEsporte
        open={modal === Modals.CriarEsporte}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleCriarEsporte}
      />

      <ModalCriarBloco 
        open={modal === Modals.CriarBloco} 
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleCriarBloco}
      />

      <ModalCriarQuadra
        open={modal === Modals.CriarQuadra}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleCriarQuadra}
        esportes={esportes}
        blocos={blocos}
      />

      <ModalCriarAgendamento
        open={modal === Modals.CriarAgendamento}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleCriarAgendamento}
        blocoOptions={blocoOptions}
        quadraOptions={quadraOptions}
      />

      <ModalExclusaoAgendamento
        open={modal === Modals.ExclusaoAgendamento && selectedAgendamento !== null}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleExcluirAgendamento}
      />

      <ModalExclusaoEsporte
        open={modal === Modals.ExclusaoEsporte && selectedEsporte !== null}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleExcluirEsporte}
      />

      <ModalCriarBolsista 
        open={modal === Modals.CriarBolsista}
        handleClose={() => setModal(Modals.None)}
        handleSubmit={handleCriarBolsista}
      />
    </>
  )}

    </MainContainer>
  )
}
