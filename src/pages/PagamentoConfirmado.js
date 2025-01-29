import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Lottie from 'react-lottie';
import fireworksAnimation from './../assets/fireworks.json';

const PagamentoConfirmado = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Detectar se é um dispositivo móvel
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Definir 768px como limite para mobile
        };

        handleResize(); // Verificar no primeiro render
        window.addEventListener('resize', handleResize); // Atualizar ao redimensionar

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!state) {
        return <div>Erro: Dados não encontrados.</div>;
    }

    const { passagem, valorTotal, selecionado, acompanhantes } = state;

    const formatarAssentos = (selecionados) => {
        return selecionados.length > 0 ? selecionados.join(', ') : 'Nenhum assento selecionado';
    };

    const formatarAcompanhantes = (acompanhantes) => {
        return acompanhantes.length > 0 ? `${acompanhantes.length} acompanhante(s)` : 'Nenhum acompanhante';
    };

    // Estilos do PDF
    const styles = StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: '#f5f5f5',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#e01a66',
            padding: 10,
        },
        logo: {
            height: 50,
            width: 50,
        },
        title: {
            fontSize: 20,
            color: '#fff',
        },
        sectionTitle: {
            fontSize: 18,
            color: '#e01a66',
            marginVertical: 10,
        },
        block: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        item: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 5,
            fontSize: 12,
            color: '#555',
        },
        divider: {
            height: 1,
            backgroundColor: '#ddd',
            marginVertical: 10,
        },
    });

    const handleVoltar = () => {
        navigate('/');
    };

    // Definir o conteúdo do PDF
    const PDFDocument = () => (
        <Document>
            <Page size="A4" style={styles.container}>
                <View style={styles.header}>
                    <Image
                        style={styles.logo}
                        src={require('./../assets/logoPDF.png')} // Logo da Empresa
                    />
                    <Text style={styles.title}>Partiu Brás</Text>
                </View>

                <Text style={styles.sectionTitle}>{passagem.origem} - {passagem.destino}</Text>

                <View style={styles.block}>
                    <View style={styles.item}>
                        <Text>Data: {passagem.data}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>Hora: {passagem.horario}</Text>
                    </View>
                </View>

                <View style={styles.block}>
                    <View style={styles.item}>
                        <Text>Nome: {state.usuario}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>RG:</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>CPF:</Text>
                    </View>
                </View>

                <View style={styles.block}>
                    <View style={styles.item}>
                        <Text>Assentos Selecionados: {formatarAssentos(selecionado)}</Text>
                    </View>
                </View>

                <View style={styles.divider}></View>

                <Text style={styles.sectionTitle}>Acompanhantes</Text>
                {acompanhantes.length === 0 ? (
                    <Text style={styles.item}>Nenhum acompanhante</Text>
                ) : (
                    acompanhantes.map((acompanhante, index) => (
                        <View key={index} style={styles.block}>
                            <View style={styles.item}>
                                <Text>Nome: {`${acompanhante.nome} ${acompanhante.sobrenome}`}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text>RG: {acompanhante.rg}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text>CPF: {acompanhante.cpf}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text>Assento: {acompanhante.numeroAssento}</Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.divider}></View>

                <View style={styles.block}>
                    <View style={styles.item}>
                        <Text>Valor por Assento: R$ {(valorTotal / selecionado.length).toFixed(2)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>Valor Total: R$ {valorTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>Pagamento: {state.pagamentoMetodo}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="pagamento-confirmado-container" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Independentemente do dispositivo, mostrar o botão de download do PDF */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#e01a66' }}>Obrigado por sua compra!</h3>
                <p style={{ marginBottom: '20px' }}>Baixe o seu comprovante no link abaixo:</p>

                {/* Animação dos fogos de artifício */}
                <div style={{ position: 'relative', height: '300px', marginBottom: '20px' }}>
                    <Lottie
                        options={{
                            animationData: fireworksAnimation,
                            loop: true,
                            autoplay: true, // Iniciar automaticamente
                        }}
                        height={300}
                        width={300}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    />
                </div>

                <PDFDownloadLink
                    document={<PDFDocument />}
                    fileName="confirmacao_passagem.pdf"
                    style={{
                        textDecoration: 'none',
                        padding: '10px 20px',
                        backgroundColor: '#e01a66',
                        color: 'white',
                        borderRadius: '5px',
                    }}
                >
                    {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF')}
                </PDFDownloadLink>
            </div>

            {/* botoes */}
            <div className="actions" style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    className="button"
                    onClick={handleVoltar}
                    style={{
                        backgroundColor: '#e01a66',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Voltar para o Início
                </button>
            </div>
        </div>
    );
};

export default PagamentoConfirmado;
