import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList} from 'react-native';
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];
function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}
function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);

  if (places === 0) {
    return 'Complet';
  } else if (places <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}
const totalEvenements = evenements.length;
const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;
const evenementsDisponibles = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;
const totalPlacesRestantes = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);
const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);
const mode = 'tous';
type BadgeEtatProps = {
  statut: string;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = '#4CAF50';

  if (statut === 'Complet') {
    couleur = '#FFCDD2';
  } else if (statut === 'Presque complet') {
    couleur = '#FFE0B2';
  }

  return (
    <View style={{
      backgroundColor: couleur,
      padding: 8,
      borderRadius: 10,
    }}>
      <Text>{statut}</Text>
    </View>
  );
}
type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      padding: 15,
      marginVertical: 8,
      borderRadius: 12,
      elevation: 3,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {evenement.titre}
      </Text>

      <Text>
        Catégorie : {evenement.categorie}
      </Text>

      <Text>
        Places restantes : {placesRestantes(evenement)}
      </Text>

      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}
type BlocStatistiqueProps = {
  titre: string;
  valeur: number;
};

function BlocStatistique({ titre, valeur }: BlocStatistiqueProps) {
  return (
    <View style={{
      backgroundColor: '#E3F2FD',
      padding: 15,
      margin: 5,
      borderRadius: 12,
      flex: 1,
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 14 }}>
        {titre}
      </Text>

      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1565C0',
      }}>
        {valeur}
      </Text>
    </View>
  );
}
export default function App() {
  const evenementsAffiches =
    mode === 'tous' ? evenements : ateliersDisponibles;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.titre}>
        CampusAgenda
      </Text>

      <Text style={styles.sousTitre}>
        Événements du campus
      </Text>

      <View style={styles.statistiques}>
        <BlocStatistique
          titre="Total événements"
          valeur={totalEvenements}
        />

        <BlocStatistique
          titre="Événements complets"
          valeur={evenementsComplets}
        />
      </View>

      <View style={styles.statistiques}>
        <BlocStatistique
          titre="Événements disponibles"
          valeur={evenementsDisponibles}
        />

        <BlocStatistique
          titre="Places restantes"
          valeur={totalPlacesRestantes}
        />
      </View>

      <Text style={styles.titreListe}>
        {mode === 'tous'
          ? 'Tous les événements'
          : 'Ateliers disponibles'}
      </Text>

      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement disponible.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingTop: 50,
  },
  titre: { fontSize: 28, fontWeight: 'bold', color: '#1565C0', },
  sousTitre: { fontSize: 16, color: '#666', marginBottom: 20, },
  statistiques: { flexDirection: 'row',justifyContent: 'space-between',},
  titreListe: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10,},
  messageVide: {textAlign: 'center',marginTop: 30, fontSize: 16, },
});
