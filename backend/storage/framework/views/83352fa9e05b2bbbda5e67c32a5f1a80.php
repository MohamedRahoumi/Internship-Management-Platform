<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Offre de Stage</title>
    <style>
        @page { margin: 30px 50px; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11pt;
            color: #000;
            line-height: 1.35;
            margin: 0;
            padding: 0;
        }

        .header-container {
            overflow: hidden;
            margin-bottom: 12px;
        }
        .header-left {
            float: left;
        }
        .logo-ocp {
            max-height: 40px;
            display: block;
        }
        .site-info {
            font-weight: bold;
            font-size: 11pt;
        }
        .header-right {
            float: right;
            font-weight: bold;
            font-size: 11pt;
            padding-top: 10px;
        }

        .ref-line {
            clear: both;
            font-weight: bold;
            font-size: 11pt;
            margin-bottom: 6px;
        }

        .recipient-block {
            font-size: 11pt;
            margin-bottom: 12px;
            line-height: 1.3;
        }

        .subject {
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 12px;
        }

        .body-text {
            text-align: justify;
            font-size: 11pt;
            margin-bottom: 10px;
            text-indent: 35px;
            line-height: 1.4;
        }

        .details-container {
            margin-bottom: 10px;
        }
        .detail-item {
            font-size: 11pt;
            margin-bottom: 3px;
        }
        .detail-item strong {
            font-weight: bold;
        }

        .signature-zone {
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .stamp-wrapper {
            float: left;
            text-align: left;
        }
        .stamp-wrapper img {
            max-width: 130px;
            display: block;
        }

        .signature-wrapper {
            float: right;
            text-align: right;
            font-weight: bold;
            font-size: 11pt;
        }
        .signature-wrapper img {
            max-width: 140px;
            display: block;
            margin-left: auto;
        }

        .nb-title {
            color: #0000ff;
            font-size: 10pt;
            margin-top: 8px;
            margin-bottom: 3px;
        }
        .nb-item {
            color: #0000ff;
            font-size: 9pt;
            margin-bottom: 1px;
            margin-left: 15px;
        }
    </style>
</head>
<body>

    <div class="header-container">
        <div class="header-left">
            <img src="<?php echo e(base64_image(public_path('logo.jpg'))); ?>" alt="Logo OCP" class="logo-ocp" />
            <div class="site-info">Plateforme Industrielle Safi (MFS)</div>
        </div>
        <div class="header-right">Safi, <?php echo e(now()->locale('fr')->isoFormat('D MMMM YYYY')); ?></div>
    </div>

    <div class="ref-line">Réf : <?php echo e($intern->id); ?></div>

    <div class="recipient-block">
        <div><?php echo e($intern->user->civility ?? 'Monsieur'); ?> <?php echo e($intern->user->prenom); ?> <?php echo e($intern->user->nom); ?></div>
        <div><?php echo e($application->nom_complet_etablissement ?: $application->etablissement); ?></div>
    </div>

    <div class="subject">Objet: Votre Offre de Stage</div>

    <div class="body-text">
        Suite à votre demande, nous avons le plaisir de vous faire part de notre accord pour vous accueillir en stage au sein du Groupe OCP site de Safi.
    </div>

    <div class="details-container">
        <div class="detail-item">• Spécialité : <strong><?php echo e($application->specialite); ?></strong></div>
        <div class="detail-item">• Niveau d'étude : <strong><?php echo e($application->niveau_etude); ?></strong></div>
        <div class="detail-item">• Période de stage : Du <strong><?php echo e(\Carbon\Carbon::parse($application->date_debut)->format('d/m/Y')); ?></strong> au <strong><?php echo e(\Carbon\Carbon::parse($application->date_fin)->format('d/m/Y')); ?></strong></div>
        <div class="detail-item">• Localisation : <strong><?php echo e($intern->department->localisation ?? 'Safi'); ?></strong></div>
        <div class="detail-item">• Direction d'accueil : <strong><?php echo e($intern->department->name); ?></strong></div>
        <div class="detail-item">• Service d'accueil : <strong><?php echo e($intern->department->name ?? 'OMS'); ?></strong></div>
        <div class="detail-item">• Parrain de stage : <strong><?php echo e($intern->supervisor?->prenom); ?> <?php echo e($intern->supervisor?->nom); ?></strong></div>
    </div>

    <div class="signature-zone">
        <div class="stamp-wrapper">
            <img src="<?php echo e(base64_image(public_path('cacher.jpg'))); ?>" alt="Cachet OCP.SA" />
        </div>
        <div class="signature-wrapper">
            Responsable Développement RH
            <img src="<?php echo e(base64_image(public_path('singaiture.jpg'))); ?>" alt="Signature Laila EL HANAOUI" />
        </div>
    </div>

    <div class="nb-title">NB:</div>
    <div class="nb-item">- Lieu d'accueil : Centre de formation OCP- Safi</div>
    <div class="nb-item">- Horaire : 7h45 & (8h45 pendant le mois de Ramadan)</div>
    <div class="nb-item">- Moyen de transport : Autocars de l'OCP</div>
    <div class="nb-item">- Ligne de départ : Se renseigner auprès des habitants de votre quartier</div>

</body>
</html>
<?php /**PATH /var/www/html/resources/views/offres/template.blade.php ENDPATH**/ ?>